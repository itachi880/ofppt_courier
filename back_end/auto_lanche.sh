#!/bin/bash

# Navigate to the backend directory
cd /courrier/back_end || { echo "❌ Backend directory not found!"; exit 1; }

# Start the backend application in the background
echo "🚀 Starting the backend application in the background..."
nohup node index.js > backend.log 2>&1 &

