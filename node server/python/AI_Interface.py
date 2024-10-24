from data_types import UnclassifiedContent, ContentParameters, Sentiment
def classify(content: UnclassifiedContent):
    output = ContentParameters(
        username=content.username,
        content_body=content.content_body,
        date=content.date,
        source_url=content.source_url,
        explicit=True,
        sentiment=Sentiment.NEGATIVE
    )
    return output