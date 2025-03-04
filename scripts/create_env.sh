ENV_NAME="py-env"

cd ../frontend
npm install

cd ../backend
npm install

cd python

python3 -m venv "$ENV_NAME"
. "$ENV_NAME/bin/activate"

pip install torch
pip install transformers
pip install pandas
pip install requests
pip install praw
pip install python-dotenv

deactivate