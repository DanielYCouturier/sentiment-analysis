from data_types import UnclassifiedContent, ContentParameters, Sentiment, Source
from transformers import BertTokenizer, BertForSequenceClassification
from datetime import datetime
import torch

# Load the tokenizer and model once (global for reuse)
model_path = './sentiment_model'
tokenizer = BertTokenizer.from_pretrained(model_path)
model = BertForSequenceClassification.from_pretrained(model_path)

# Ensure the model is on the correct device (GPU or CPU)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

def classify(content: UnclassifiedContent) -> ContentParameters:

    # Predict sentiment
    def predict_sentiment(text: str)-> Sentiment:
        # Tokenize the input text
        inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=128)
        inputs = {key: value.to(device) for key, value in inputs.items()}  # Move inputs to device

        # Perform inference
        with torch.no_grad():
            outputs = model(**inputs)
            probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
            sentiment = torch.argmax(probs).item()

        # Map sentiment labels to Sentiment enum
        if (sentiment == 0):
            return Sentiment.NEGATIVE
        elif (sentiment == 1):
            return Sentiment.POSITIVE
        elif (sentiment == 2):
            return Sentiment.NEUTRAL
        else:
            raise ValueError(f"Unexpected sentiment class: {sentiment}")

    # Predict the sentiment of the content body
    predicted_sentiment = predict_sentiment(content.content_body)

    # Create and return the classified ContentParameters object
    return ContentParameters(
        title=content.title,
        username=content.username,
        content_body=content.content_body,
        date=content.date,
        source=content.source,
        source_url=content.source_url,
        explicit=True,
        sentiment=predicted_sentiment
    )