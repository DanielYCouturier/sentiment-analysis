from schemas.user_sentiment_schema import UrlSentiment, SentimentCorrection
from flask import  request, jsonify

def correct_sentiment():
    data = request.json
    url = data.get('url')
    sentiment = data.get('sentiment')

    if url is None or sentiment not in [-1, 0, 1]:
        return jsonify({"error": "Invalid input"}), 400

    correction = SentimentCorrection(sentiment=sentiment)
    UrlSentiment.objects(url=url).modify(
        upsert=True,
        new=True,
        set_on_insert__url=url,
        push__corrections=correction
    )

    print(f"Saved correction for URL: {url} -> Sentiment: {sentiment}")
    return jsonify({"message": "Correction saved", "url": url, "sentiment": sentiment})