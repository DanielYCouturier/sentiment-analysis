import mongoengine as db
from schemas.content_schema import Content
class Query(db.Document):
    keyword = db.StringField(required=True)
    source = db.StringField(required=True)
    datestart = db.DateTimeField(required=True)
    dateend = db.DateTimeField(required=True)
    requestcount = db.IntField(required=True)
    contentid = db.ListField(db.ReferenceField(Content))
