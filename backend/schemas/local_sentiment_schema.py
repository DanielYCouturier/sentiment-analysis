import mongoengine as db
class LocalSentiment(db.Document):
    url = db.StringField(required=True, unique=True)
    sentiment = db.FloatField(required=True)