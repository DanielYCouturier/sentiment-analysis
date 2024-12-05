from data_types import UnclassifiedContent, ContentParameters, Sentiment, Source
from transformers import BertTokenizer, BertForSequenceClassification
from datetime import datetime
import torch

# Load the tokenizer and model once (global for reuse)
local_model_path = './python/sentiment_model'
tokenizer = BertTokenizer.from_pretrained(local_model_path)
local_model = BertForSequenceClassification.from_pretrained(local_model_path)

# Ensure the model is on the correct device (GPU or CPU)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
local_model.to(device)

# Global variable for model selection
MODEL_SELECTION = "LOCAL"  # Options: LOCAL, CHATGPT, GEMINI

def classify_with_local_model(content_body: str) -> Sentiment:
    """Classifies sentiment using the local AI model."""
    inputs = tokenizer(content_body, return_tensors="pt", truncation=True, padding=True, max_length=128)
    inputs = {key: value.to(device) for key, value in inputs.items()}  # Move inputs to device

    with torch.no_grad():
        outputs = local_model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
        sentiment = torch.argmax(probs).item()

    # Map sentiment labels to Sentiment enum
    if sentiment == 0:
        return Sentiment.NEGATIVE
    elif sentiment == 1:
        return Sentiment.POSITIVE
    elif sentiment == 2:
        return Sentiment.NEUTRAL
    else:
        raise ValueError(f"Unexpected sentiment class: {sentiment}")

def classify_with_external_model(content_body: str, model_name: str) -> Sentiment:
    """Stub for classifying sentiment with an external model (ChatGPT or Gemini)."""
    # Replace this stub with actual API calls to ChatGPT or Gemini as needed
    print(f"Using {model_name} model for sentiment analysis.")
    return Sentiment.NEUTRAL  # Stub response

def classify(content: UnclassifiedContent, model: str) -> ContentParameters:
    """Classifies content using the selected AI model."""
    global MODEL_SELECTION
    MODEL_SELECTION = model.upper()  # Ensure proper case handling

    if MODEL_SELECTION == "LOCAL":
        predicted_sentiment = classify_with_local_model(content.content_body)
    elif MODEL_SELECTION in ["CHATGPT", "GEMINI"]:
        predicted_sentiment = classify_with_external_model(content.content_body, MODEL_SELECTION)
    else:
        raise ValueError(f"Unsupported model selection: {MODEL_SELECTION}")

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
