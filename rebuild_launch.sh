#!/bin/bash
cd frontend
npm run build
cd ..
cd backend
./reset_statics.sh
cd ..
heroku local
