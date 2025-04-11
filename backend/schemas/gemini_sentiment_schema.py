import mongoengine as db
class GeminiSentiment(db.Document):
    url = db.StringField(required=True, unique=True)
    sentiment = db.FloatField(required=True)