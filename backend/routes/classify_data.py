from flask import request, jsonify
from schemas.local_sentiment_schema import LocalSentiment
from schemas.content_schema import Content
from classify.ai_interface import classify
def classify_data():
    data = request.get_json()
    urls = data.get('urls', [])
    result = {}

    for url in urls:
        # Check if sentiment exists in LocalSentiment table
        sentiment_record = LocalSentiment.objects(url=url).first()
        
        if sentiment_record:
            sentiment = sentiment_record.sentiment
        else:
            # Find associated content body
            content_record = Content.objects(source_url=url).first()
            if content_record:
                sentiment = classify(content_record.content_body)
                # Store new sentiment in LocalSentiment table
                LocalSentiment(url=url, sentiment=sentiment).save()
            else:
                sentiment = None  # URL not found in the database

        result[url] = sentiment

    return jsonify(result)