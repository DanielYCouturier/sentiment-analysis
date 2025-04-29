from flask import request, jsonify
from schemas.user_sentiment_schema import UrlSentiment
def classify_user():
    data = request.json
    urls = data.get('urls')

    if not urls or not isinstance(urls, list):
        return jsonify({"error": "Invalid input. Expected a list of URLs under 'urls' key."}), 400

    result = {}

    for url in urls:
        doc = UrlSentiment.objects(url=url).first()
        if doc and doc.corrections:
            sentiments = [c.sentiment for c in doc.corrections]
            avg_sentiment = sum(sentiments) / len(sentiments)
            result[url] = avg_sentiment
        else:
            result[url] = None

    return jsonify(result)