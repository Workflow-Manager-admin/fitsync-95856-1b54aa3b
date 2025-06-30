#!/bin/bash
cd /home/kavia/workspace/code-generation/fitsync-95856-1b54aa3b/fitness_workout_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

