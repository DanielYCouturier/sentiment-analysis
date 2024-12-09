# sentiment-analysis

Install Dependencies:
1. Ensure Ubuntu version 24.04 LTS ("Noble"), 22.04 LTS ("Jammy"), or 20.04 LTS ("Focal")
2. Install MongoDB 8.0 community version by following instructions https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/
3. sudo apt update
4. sudo apt install nodejs
5. sudo apt install npm
6. sudo apt install python3 (if not already)

Steps to setup dev environment 
1. run /scripts/create_env.sh
2. wait a long time
3. copy model file from https://drive.google.com/file/d/1W6NMfj0IK4477x-6QSKY9ApWTMGBMJwg/view?usp=sharing to /backend/python/sentiment_model

Steps to run:
1. run /scripts/run_backend.sh
2. run /scripts/run_frontend.sh (different terminal)
3. open http://localhost:3000/