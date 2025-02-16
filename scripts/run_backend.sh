ENV_NAME="py-env"
cd ../backend && \
. "python/$ENV_NAME/bin/activate" && \
sudo systemctl start mongod && \
npm start
