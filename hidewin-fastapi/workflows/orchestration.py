from agents.meeting_agent import MeetingObserverAgent
from agents.agile_agent import AgileReporterAgent

class Orchestrator:
    def __init__(self):
        self.meeting_agent = MeetingObserverAgent()
        self.agile_agent = AgileReporterAgent()
        
    def process_audio_stream(self, text_chunk: str, user_integrations: dict) -> str:
        """
        Receives transcribed audio chunks from Kafka or WebSockets.
        If a Standup question is detected, spins up the Agile agent.
        """
        # 1. Listen
        is_standup_requested = self.meeting_agent.analyze_chunk(text_chunk)
        
        # 2. Act
        if is_standup_requested:
            git_token = user_integrations.get("git_token", "")
            jira_token = user_integrations.get("jira_token", "")
            user_email = user_integrations.get("user_email", "")
            
            # Formulate response
            standup_response = self.agile_agent.generate_standup(git_token, jira_token, user_email)
            return standup_response
            
        return ""
