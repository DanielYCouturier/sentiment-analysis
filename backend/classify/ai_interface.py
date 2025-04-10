from transformers import BertTokenizer, BertForSequenceClassification
import torch

# Use the Hugging Face model identifier for the sentiment analysis model
model_name = 'textattack/bert-base-uncased-imdb'

# Load the tokenizer and model from the Hugging Face hub
tokenizer = BertTokenizer.from_pretrained(model_name)
local_model = BertForSequenceClassification.from_pretrained(model_name)

# Ensure the model is on the correct device (GPU if available, otherwise CPU)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
local_model.to(device)

# Global variable for model selection
MODEL_SELECTION = "LOCAL"  # Options: LOCAL, CHATGPT, GEMINI

def classify_with_local_model(content_body: str):
    """Classifies sentiment using the local AI model."""
    # Tokenize and encode the input text
    inputs = tokenizer(
        content_body,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=128
    )
    # Move inputs to the same device as the model
    inputs = {key: value.to(device) for key, value in inputs.items()}

    # Perform inference without gradient calculation
    with torch.no_grad():
        outputs = local_model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
        sentiment = torch.argmax(probs).item()

    # Map sentiment labels to a defined sentiment value
    if sentiment == 0:
        # For example, you might define 0 as negative sentiment
        return -1
    elif sentiment == 1:
        # And 1 as positive sentiment
        return 1
    elif sentiment == 2:
        # If available, 2 might be neutral sentiment
        return 0
    else:
        raise ValueError(f"Unexpected sentiment class: {sentiment}")

def classify_with_external_model(content: str, model_name: str):
    """Stub for classifying sentiment with an external model (ChatGPT or Gemini)."""
    # Replace this stub with actual API calls to ChatGPT or Gemini when needed
    print(f"Using {model_name} model for sentiment analysis.")
    return 0  # Stub response

def classify(content, model: str = "LOCAL"):
    """Classifies content using the selected AI model."""
    global MODEL_SELECTION
    MODEL_SELECTION = model.upper()  # Normalize model name for comparisons

    if MODEL_SELECTION == "LOCAL":
        predicted_sentiment = classify_with_local_model(content)
    elif MODEL_SELECTION in ["CHATGPT", "GEMINI"]:
        predicted_sentiment = classify_with_external_model(content, MODEL_SELECTION)
    else:
        raise ValueError(f"Unsupported model selection: {MODEL_SELECTION}")

    return predicted_sentiment
