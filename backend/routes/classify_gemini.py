from flask import request, jsonify
import google.generativeai as genai
from schemas.content_schema import Content
from schemas.gemini_sentiment_schema import GeminiSentiment

# Initialize Gemini model
genai.configure(api_key="REDACTED")


import google.generativeai as genai

# Create the model object
model = genai.GenerativeModel("models/gemini-1.5-flash")

def classify_text_with_gemini(text, max_words=50):
    """Classify sentiment using Gemini. Returns float between -1 and 1."""
    words = text.split()
    truncated = False

    if len(words) > max_words:
        words = words[:max_words]
        truncated = True

    short_text = " ".join(words)
    if truncated:
        short_text += " ..."

    prompt = f"""Analyze the sentiment of the following content and return a single float between -1 (very negative) and 1 (very positive), where 0 is neutral. Just respond with the number only.

Content:
{short_text}
"""

    try:
        response = model.generate_content(prompt)
        score_str = response.text.strip()
        return float(score_str)
    except Exception as e:
        print(f"Error during sentiment classification: {e}")
        return None

def classify_gemini():
    data = request.get_json()
    urls = data.get('urls', [])
    result = {}

    for url in urls:
        try:
            sentiment_record = GeminiSentiment.objects(url=url).first()

            if sentiment_record:
                sentiment = sentiment_record.sentiment
            else:
                content_record = Content.objects(source_url=url).first()
                if content_record:
                    sentiment = classify_text_with_gemini(content_record.content_body)
                    if sentiment is not None:
                        GeminiSentiment(url=url, sentiment=sentiment).save()
                else:
                    sentiment = None  # URL not found in the database

            result[url] = sentiment
        except Exception as e:
            print(f"Error processing URL {url}: {e}")
            result[url] = None

    return jsonify(result)