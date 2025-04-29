import mongoengine as db
class Content(db.Document):
    title = db.StringField(required=True)
    username = db.StringField()
    content_body = db.StringField(required=True)
    date = db.DateTimeField(required=True)
    source = db.StringField(required=True)
    source_url = db.StringField(required=True)

