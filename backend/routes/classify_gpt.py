from flask import request, jsonify
from openai import OpenAI
from schemas.gpt_sentiment_schema import GPTSentiment
from schemas.content_schema import Content

# Initialize OpenAI client
client = OpenAI(api_key="REDACTED")
def classify_text_with_gpt(text, max_words=50):
    """Classify sentiment using GPT-3.5 with text length capped. Returns float between -1 and 1."""
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
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2
        )
        score_str = response.choices[0].message.content.strip()
        return float(score_str)
    except Exception as e:
        print(f"Error during sentiment classification: {e}")
        return None

def classify_gpt():
    data = request.get_json()
    urls = data.get('urls', [])
    result = {}

    for url in urls:
        try:
            sentiment_record = GPTSentiment.objects(url=url).first()

            if sentiment_record:
                sentiment = sentiment_record.sentiment
            else:
                content_record = Content.objects(source_url=url).first()
                if content_record:
                    sentiment = classify_text_with_gpt(content_record.content_body)
                    if sentiment is not None:
                        GPTSentiment(url=url, sentiment=sentiment).save()
                else:
                    sentiment = None  # URL not found in the database

            result[url] = sentiment
        except Exception as e:
            print(f"Error processing URL {url}: {e}")
            result[url] = None

    return jsonify(result)