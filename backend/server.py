from flask import Flask
from flask_cors import CORS
from mongoengine import connect
from routes.get_data import get_data  
from routes.classify_data import classify_data
from routes.classify_gpt import classify_gpt
from routes.classify_gemini import classify_gemini
from routes.new_correction import correct_sentiment
from routes.classify_user import classify_user
app = Flask(__name__)
CORS(app, supports_credentials=True)

connect('sentiment-analysis', host='mongodb://localhost:27017/')


app.route('/getData', methods=['POST'])(get_data)
app.route('/classifyData', methods=['POST'])(classify_data)
app.route('/classifyGPT', methods=['POST'])(classify_gpt)
app.route('/classifyGemini', methods=['POST'])(classify_gemini)
app.route('/correct_sentiment', methods=['POST'])(correct_sentiment)
app.route('/classifyUser',  methods=['POST'])(classify_user)



if __name__ == '__main__':
    app.run(port=5000, debug=True) # TODO: set debug to false in production
