from scraping.data_types import *
from scraping.split_all import split
from typing import List

def format_data(content_list: List[UnclassifiedContent]):
    content_dicts = [
        {
            "title": content.title,
            "username": content.username,
            "content_body": content.content_body,
            "date": content.date.isoformat(),
            "source": content.source.value,
            "source_url": content.source_url,
        } 
        for content in content_list
    ]
    return content_dicts

def scrape_data(query:str, date_start:str, date_end:str, sources:str, sentiment:str):
    source = parse_source(sources)
    website_list = []
    if(source == Source.ALL):
        website_list = [Source.REDDIT,Source.BUGZILLA]
    else:
        website_list = [source]
    request_params = RequestParameters(
        query=query,
        date_start=date_start,
        date_end=date_end,
        websites=website_list,
        sentiment=parse_sentiment(sentiment)
    )
    content_list = split(request_params, model= "LOCAL")
    return format_data(content_list)
