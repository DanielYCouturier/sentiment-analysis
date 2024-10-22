from  datetime import datetime
import json
import sys
from data_types import *
from SplitAll import split


def main(query, date_start, date_end, sources, sentiment):
    request_params = RequestParameters(
        query=query,
        date_start=date_start,
        date_end=date_end,
        websites=sources,
        sentiment=sentiment
    )
    output = split(request_params)
    contents = [
        ContentParameters(
            username="John Doe",
            content_body="This is the content body.",
            date=datetime(2024, 10, 21),
            source_url="http://example.com",
            explicit=False,
            sentiment=Sentiment.POSITIVE
        ),
        ContentParameters(
            username="Jane Doe",
            content_body="Another content body example.",
            date=datetime(2024, 10, 22),
            source_url="http://example.org",
            explicit=True,
            sentiment=Sentiment.NEGATIVE
        )
    ]
    content_dicts = [
        {
            "username": content.username,
            "content_body": content.content_body,
            "date": content.date.isoformat(),
            "source_url": content.source_url,
            "explicit": content.explicit,
            "sentiment": content.sentiment.value
        } 
        for content in contents
    ]
    print(json.dumps(content_dicts))


if __name__ == "__main__":
    query, date_start, date_end, sources, sentiment = json.loads(sys.argv[1])
    main(query, date_start, date_end, sources, sentiment)
