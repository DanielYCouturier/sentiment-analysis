from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

model_name = 'nlptown/bert-base-multilingual-uncased-sentiment'

tokenizer = AutoTokenizer.from_pretrained(model_name)
local_model = AutoModelForSequenceClassification.from_pretrained(model_name)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
local_model.to(device)

def classify_with_local_model(content_body: str):
    """Classifies sentiment using the local AI model (1-5 star rating)."""
    inputs = tokenizer(
        content_body,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=128
    )
    inputs = {key: value.to(device) for key, value in inputs.items()}

    with torch.no_grad():
        outputs = local_model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
        sentiment = torch.argmax(probs).item()

    mapped_sentiment = (sentiment - 2)/2 # maps 0-4 - > -1 --1 
    return mapped_sentiment
