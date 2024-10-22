from dataclasses import dataclass
from enum import Enum
from  datetime import datetime
from typing import List

class Sentiment(Enum):
    POSITIVE = "POSITIVE"
    NEGATIVE = "NEGATIVE"
    NEUTRAL = "NEUTRAL"
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