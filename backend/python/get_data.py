from  datetime import datetime
import json
import sys
from data_types import *
from SplitAll import split
from typing import List
from sentiment_logging import *

def global_return(content_list: List[ContentParameters]):
    """
    Convert a list of ContentParameters to a list of dictionaries for returning as JSON.
    Args:
        content_list (List[ContentParameters]): List of classified content.
    Returns:
        JSONified list to stdout
    """
    content_dicts = [
        {
            "title": content.title,
            "username": content.username,
            "content_body": content.content_body,
            "date": content.date.isoformat(),
            "source": content.source.value,
            "source_url": content.source_url,
            "explicit": content.explicit,
            "sentiment": content.sentiment.value
        } 
        for content in content_list
    ]
    print(json.dumps(content_dicts))
    exit()

def main(query:str, date_start:str, date_end:str, sources:str, sentiment:str):
    date_format = "%Y-%m-%d"
    source = parse_source(sources)
    website_list = []
    if(source == Source.ALL):
        website_list = [Source.REDDIT,Source.BUGZILLA]
    else:
        website_list = [source]
    request_params = RequestParameters(
        query=query,
        date_start=datetime.strptime(date_start, date_format),
        date_end=datetime.strptime(date_end, date_format),
        websites=website_list,
        sentiment=parse_sentiment(sentiment)
    )
    content_list = split(request_params, model= "LOCAL")
    global_return(content_list)

if __name__ == "__main__":
    query, date_start, date_end, sources, sentiment = json.loads(sys.argv[1])
    catch_all(
        main(query, date_start, date_end, sources, sentiment)
    )