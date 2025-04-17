# models.py
from mongoengine import Document, StringField, IntField, DateTimeField, ListField, EmbeddedDocument, EmbeddedDocumentField
from datetime import datetime

class SentimentCorrection(EmbeddedDocument):
    sentiment = IntField(required=True, choices=[-1, 0, 1])
    timestamp = DateTimeField(default=datetime.utcnow)

class UrlSentiment(Document):
    url = StringField(required=True, unique=True)
    corrections = ListField(EmbeddedDocumentField(SentimentCorrection))