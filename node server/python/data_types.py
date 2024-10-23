from dataclasses import dataclass
from enum import Enum
from  datetime import datetime
from typing import List

class Sentiment(Enum):
    POSITIVE = "POSITIVE"
    NEGATIVE = "NEGATIVE"
    NEUTRAL = "NEUTRAL"
    ALL = "ALL"
class Source(Enum):
    REDDIT = "REDDIT"
    BUGZILLA= "BUGZILLA"
    ALL = "ALL"

def parse_sentiment(sentiment_str: str) -> Sentiment:
    try:
        return Sentiment[sentiment_str.upper()]
    except KeyError:
        raise ValueError(f"Invalid sentiment: {sentiment_str}")

def parse_source(source_str: str) -> Source:
    try:
        return Source[source_str.upper()]
    except KeyError:
        raise ValueError(f"Invalid source: {source_str}")
@dataclass
class ContentParameters:
    username: str
    content_body: str
    date: datetime
    source_url: str
    explicit: bool
    sentiment: Sentiment
@dataclass
class RequestParameters:
    query: str
    date_start: datetime
    date_end: datetime
    websites: List[str]
    sentiment: Sentiment