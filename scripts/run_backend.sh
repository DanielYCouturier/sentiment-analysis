ENV_NAME="py-env"

cd ../backend

source "python/$ENV_NAME/bin/activate"
sudo systemctl start mongod

npm start
