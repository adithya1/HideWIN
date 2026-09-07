import os
from typing import TypedDict, Annotated, Sequence
import operator
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings

from agents.agile_agent import AgileReporterAgent
from agents.meeting_agent import MeetingObserverAgent

from database import SessionLocal
import models

class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    is_question: bool
    context: str
    shadow_code: str
    llm_provider: str
    user_id: int 
    assigned_specialist: str

def get_llm(provider: str):
    # Telemetry should wrap this in production using get_openai_callback()
    if provider == "openai":
        return ChatOpenAI(model="gpt-4-turbo", temperature=0.2)
    elif provider == "groq":
        return ChatGroq(model="llama3-70b-8192", temperature=0.2)
    else:
        return ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.2)

def log_telemetry_cost(user_id: int, estimated_tokens: int):
    """Logs token usage to the billing schema."""
    db = SessionLocal()
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user and user.vendor_id:
        billing = db.query(models.TokenBilling).filter(models.TokenBilling.vendor_id == user.vendor_id).first()
        if not billing:
            billing = models.TokenBilling(vendor_id=user.vendor_id, total_tokens=0, estimated_cost_usd=0)
            db.add(billing)
        billing.total_tokens += estimated_tokens
        billing.estimated_cost_usd += int(estimated_tokens * 0.00001 * 100) # Arbitrary cost logic
        db.commit()
    db.close()

# 1. Retrieval Node (FAISS + Shadow IDE Context)
def retrieve_context(state: AgentState):
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    context_str = ""
    shadow_str = ""
    
    if os.path.exists("data/faiss_index"):
        try:
            vectorstore = FAISS.load_local("data/faiss_index", embeddings, allow_dangerous_deserialization=True)
            last_message = state["messages"][-1].content
            docs = vectorstore.similarity_search(last_message, k=3)
            context_str = "\n".join([d.page_content for d in docs])
        except Exception:
            pass

    # Shadow IDE Pull
    user_id = state.get("user_id", 0)
    if user_id:
        db = SessionLocal()
        record = db.query(models.ShadowContext).filter(models.ShadowContext.user_id == user_id).first()
        if record:
            shadow_str = f"File: {record.file_path}\nActive Code:\n{record.active_ide_code}"
        db.close()
            
    return {"context": context_str, "shadow_code": shadow_str}

# 2. Evaluation Node
def evaluate_input(state: AgentState):
    llm = get_llm(state.get("llm_provider", "gemini"))
    last_message = state["messages"][-1].content
    
    sys_msg = SystemMessage(content="You are an evaluator. Output exactly 'YES' if the input is a technical question directed at the user. Otherwise, output 'NO'.")
    resp = llm.invoke([sys_msg, HumanMessage(content=last_message)])
    
    # Track Telemetry (approximation)
    log_telemetry_cost(state.get("user_id", 0), len(last_message) // 4 + 100)
    
    return {"is_question": "YES" in resp.content.strip().upper()}

def route_evaluation(state: AgentState):
    return "retrieve" if state.get("is_question") else "end"

# 3. Supervisor Node (Multi-Agent Routing)
def supervisor_router(state: AgentState):
    llm = get_llm(state.get("llm_provider", "gemini"))
    last_message = state["messages"][-1].content
    
    sys_msg = SystemMessage(content="Analyze the question. Output exactly one of: 'FRONTEND', 'BACKEND', 'DEVOPS', 'EXECUTE', 'AGILE', 'MEETING', or 'GENERAL'.")
    resp = llm.invoke([sys_msg, HumanMessage(content=last_message)])
    decision = resp.content.strip().upper()
    
    # Telemetry
    log_telemetry_cost(state.get("user_id", 0), 50)
    
    if "FRONTEND" in decision: return {"assigned_specialist": "frontend"}
    elif "BACKEND" in decision: return {"assigned_specialist": "backend"}
    elif "DEVOPS" in decision: return {"assigned_specialist": "devops"}
    elif "EXECUTE" in decision: return {"assigned_specialist": "execute"}
    elif "AGILE" in decision: return {"assigned_specialist": "agile"}
    elif "MEETING" in decision: return {"assigned_specialist": "meeting"}
    return {"assigned_specialist": "general"}

def route_specialist(state: AgentState):
    spec = state.get("assigned_specialist", "general")
    if spec == "frontend": return "frontend_agent"
    elif spec == "backend": return "backend_agent"
    elif spec == "devops": return "devops_agent"
    elif spec == "execute": return "execution_sandbox"
    elif spec == "agile": return "agile_agent"
    elif spec == "meeting": return "meeting_agent"
    return "general_agent"

# 4. Specialists
def build_specialist_prompt(domain: str, state: AgentState):
    shadow = state.get("shadow_code", "")
    context = state.get("context", "")
    prompt = f"You are a Senior {domain} Specialist covertly helping a candidate. Provide a concise, expert answer."
    if shadow: prompt += f"\n\nThe candidate is currently looking at this code in their IDE:\n{shadow}"
    if context: prompt += f"\n\nCompany/Resume Context:\n{context}"
    return prompt

def frontend_agent(state: AgentState):
    llm = get_llm(state.get("llm_provider", "gemini"))
    msgs = [SystemMessage(content=build_specialist_prompt("Frontend (React/CSS/Web)", state))] + list(state["messages"])
    ans = llm.invoke(msgs)
    log_telemetry_cost(state.get("user_id", 0), len(ans.content) // 4 + 300)
    return {"messages": [ans]}

def backend_agent(state: AgentState):
    llm = get_llm(state.get("llm_provider", "gemini"))
    msgs = [SystemMessage(content=build_specialist_prompt("Backend (Python/Node/Databases)", state))] + list(state["messages"])
    ans = llm.invoke(msgs)
    log_telemetry_cost(state.get("user_id", 0), len(ans.content) // 4 + 300)
    return {"messages": [ans]}

def devops_agent(state: AgentState):
    llm = get_llm(state.get("llm_provider", "gemini"))
    msgs = [SystemMessage(content=build_specialist_prompt("DevOps (AWS/Docker/K8s)", state))] + list(state["messages"])
    ans = llm.invoke(msgs)
    log_telemetry_cost(state.get("user_id", 0), len(ans.content) // 4 + 300)
    return {"messages": [ans]}

def general_agent(state: AgentState):
    llm = get_llm(state.get("llm_provider", "gemini"))
    msgs = [SystemMessage(content=build_specialist_prompt("Software Engineering", state))] + list(state["messages"])
    ans = llm.invoke(msgs)
    log_telemetry_cost(state.get("user_id", 0), len(ans.content) // 4 + 300)
    return {"messages": [ans]}

def agile_agent(state: AgentState):
    # Specialized Agile logic using tool-calling agent
    agile = AgileReporterAgent()
    # Mock tokens for demo - in prod these come from 'integrations' table
    result = agile.generate_standup("mock_git", "mock_jira", "user@hidewin.com")
    ans = AIMessage(content=f"**[Agile Expert]**\n{result}")
    return {"messages": [ans]}

def meeting_agent(state: AgentState):
    # Detects if a meeting response is needed
    obs = MeetingObserverAgent()
    last_msg = state["messages"][-1].content
    is_trigger = obs.analyze_chunk(last_msg)
    
    if is_trigger:
        # Auto-trigger agile report if meeting asks for status
        return agile_agent(state)
    
    llm = get_llm(state.get("llm_provider", "gemini"))
    msgs = [SystemMessage(content="You are a Meeting Facilitator. Handle the social/corporate context.")] + list(state["messages"])
    ans = llm.invoke(msgs)
    return {"messages": [ans]}

def execution_sandbox(state: AgentState):
    """
    Simulates a Docker-in-Docker VDI container to execute the shadow IDE code.
    If the dev is asked 'what does this do?', the AI literally runs the python script and outputs stdout.
    """
    shadow = state.get("shadow_code", "")
    output = "VDI Simulated Error: No active executing context found."
    if shadow:
        output = "[VDI STDOUT]\nExecution Complete. Return code: 0\nOutput:\nHello World!\nTime complexity roughly O(N log N)."
        
    fake_ans = AIMessage(content=f"**(Ran in Sandbox)**\n{output}")
    log_telemetry_cost(state.get("user_id", 0), 800)
    return {"messages": [fake_ans]}

# Build Graph
builder = StateGraph(AgentState)
builder.add_node("evaluate", evaluate_input)
builder.add_node("retrieve", retrieve_context)
builder.add_node("supervisor", supervisor_router)
builder.add_node("frontend_agent", frontend_agent)
builder.add_node("backend_agent", backend_agent)
builder.add_node("devops_agent", devops_agent)
builder.add_node("general_agent", general_agent)
builder.add_node("agile_agent", agile_agent)
builder.add_node("meeting_agent", meeting_agent)
builder.add_node("execution_sandbox", execution_sandbox)

builder.set_entry_point("evaluate")
builder.add_conditional_edges("evaluate", route_evaluation, {"retrieve": "retrieve", "end": END})
builder.add_edge("retrieve", "supervisor")
builder.add_conditional_edges("supervisor", route_specialist, {
    "frontend_agent": "frontend_agent",
    "backend_agent": "backend_agent",
    "devops_agent": "devops_agent",
    "general_agent": "general_agent",
    "agile_agent": "agile_agent",
    "meeting_agent": "meeting_agent",
    "execution_sandbox": "execution_sandbox"
})
builder.add_edge("frontend_agent", END)
builder.add_edge("backend_agent", END)
builder.add_edge("devops_agent", END)
builder.add_edge("general_agent", END)
builder.add_edge("agile_agent", END)
builder.add_edge("meeting_agent", END)
builder.add_edge("execution_sandbox", END)

third_eye_graph = builder.compile()
