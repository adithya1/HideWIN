from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
import os

class MeetingObserverAgent:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=os.getenv("GEMINI_API_KEY", "dummy"))
        self.prompt = PromptTemplate.from_template(
            "You are an AI meeting observer. You receive a transcribed chunk of meeting dialogue. "
            "Your job is to detect if a Manager or Team Lead is asking you for a 'Status Update', 'Standup Report', or 'What you did yesterday'. "
            "If they are asking for a status update, output exactly the string 'TRIGGER_AGILE_REPORT'. "
            "Otherwise, output 'IGNORE'.\n\n"
            "Dialogue Chunk: {dialogue}"
        )
        self.chain = self.prompt | self.llm

    def analyze_chunk(self, dialogue: str) -> bool:
        result = self.chain.invoke({"dialogue": dialogue})
        return "TRIGGER_AGILE_REPORT" in result.content
