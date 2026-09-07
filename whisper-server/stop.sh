#!/bin/bash
echo "Stopping Whisper Standalone Server..."
PORT=8001
PID=$(lsof -t -i:$PORT)
if [ -z "$PID" ]; then
    echo "No server running on port $PORT."
else
    echo "Killing process $PID"
    kill -9 $PID
fi
echo "Done."
