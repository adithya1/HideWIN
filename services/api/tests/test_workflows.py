import pytest
from unittest.mock import patch, MagicMock
from workflows.orchestration import Orchestrator

def test_ignore_meaningless_audio():
    orchestrator = Orchestrator()
    
    # Mocking the AI detection to return false
    with patch('agents.meeting_agent.MeetingObserverAgent.analyze_chunk', return_value=False):
        result = orchestrator.process_audio_stream("Hi everyone, weather is nice today.", {})
        assert result == ""

def test_trigger_agile_standup():
    orchestrator = Orchestrator()
    
    with patch('agents.meeting_agent.MeetingObserverAgent.analyze_chunk', return_value=True):
        with patch('agents.agile_agent.AgileReporterAgent.generate_standup', return_value="Yesterday I committed code. Today I am working on bugs."):
            result = orchestrator.process_audio_stream("Hey developer, what is your status?", {
                "git_token": "dummy_git",
                "jira_token": "dummy_jira",
                "user_email": "dev@company.com"
            })
            assert "Yesterday I committed code" in result
