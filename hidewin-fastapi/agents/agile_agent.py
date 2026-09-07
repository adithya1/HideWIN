import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnablePassthrough

class AgileReporterAgent:
    def __init__(self, purpose: str = "PRACTICE", context_data: str = None):
        self.llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=os.getenv("GEMINI_API_KEY", "dummy"))
        
        system_msg = self._get_system_message(purpose, context_data)
        
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", system_msg),
            MessagesPlaceholder(variable_name="chat_history", optional=True),
            ("human", "{input}"),
        ])
        
        # Optimized for maximum compatibility across LangChain versions
        self.chain = self.prompt | self.llm

    def _get_system_message(self, purpose: str, context_data: str) -> str:
        base = "You are a professional assistant for HideWIN Elite. Respond in markdown. "
        
        if purpose == "INTERVIEW":
            msg = f"{base}You are an expert Interview Coach. "
            if context_data:
                msg += f"The user has uploaded their resume context: {context_data}. Use this to highlight their specific years of experience and tools when answering. Stay consistent with their profile."
            else:
                msg += "Help the user nail the interview with pro-level tech answers."
        elif purpose == "PRESENTATION":
            msg = f"{base}You are a high-level Business presentation assistant. "
            if context_data:
                msg += f"Use this presentation context: {context_data}. Provide pro-level insights, bullet points, and data-driven arguments based on this doc."
        else:
            msg = f"{base}You are a stealthy agile assistant helping the user navigate their daily work."

        return msg

    def run(self, input_text: str) -> str:
        # Compatibility wrapper for the previous .agent.run() calls
        response = self.chain.invoke({"input": input_text, "chat_history": []})
        return response.content

    def generate_standup(self, git_token: str, jira_token: str, user_email: str) -> str:
        prompt = f"Generate a 3-sentence standup update. Git: {git_token}, Jira: {jira_token}, Email: {user_email}. Output only the text to read."
        return self.run(prompt)
