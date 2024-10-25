from dataclasses import dataclass
from enum import Enum
from datetime import datetime
from typing import List

# Define the Sentiment Enum
class Sentiment(Enum):
    POSITIVE = "POSITIVE"
    NEGATIVE = "NEGATIVE"
    NEUTRAL = "NEUTRAL"
    ALL = "ALL"

# Define the Source Enum
class Source(Enum):
    REDDIT = "REDDIT"
    BUGZILLA = "BUGZILLA"
    ALL = "ALL"

# Parsing function for Sentiment Enum
def parse_sentiment(sentiment_str: str) -> Sentiment:
    """
    Parse a string to match a Sentiment Enum.

    Args:
        sentiment_str (str): The sentiment string to parse.

    Returns:
        Sentiment: The matching Sentiment Enum value, or NEUTRAL if invalid.
    """
    try:
        return Sentiment[sentiment_str.upper()]
    except KeyError:
        return Sentiment.NEUTRAL

# Parsing function for Source Enum
def parse_source(source_str: str) -> Source:
    """
    Parse a string to match a Source Enum.

    Args:
        source_str (str): The source string to parse.

    Returns:
        Source: The matching Source Enum value, or ALL if invalid.
    """
    try:
        return Source[source_str.upper()]
    except KeyError:
        return Source.ALL

# Define a data class for content parameters
@dataclass
class ContentParameters:
    username: str
    content_body: str
    date: datetime
    source_url: str
    explicit: bool = False  # Default value set to False
    sentiment: Sentiment = Sentiment.NEUTRAL  # Default value set to NEUTRAL

# Define a data class for unclassified content
@dataclass
class UnclassifiedContent:
    username: str
    content_body: str
    date: datetime
    source_url: str

    def is_valid(self) -> bool:
        """
        Check if the unclassified content has all required fields.
        
        Returns:
            bool: True if valid, False otherwise.
        """
        return bool(self.username and self.content_body and self.date)

# Define a data class for request parameters
@dataclass
class RequestParameters:
    query: str
    date_start: datetime
    date_end: datetime
    websites: List[Source]
    sentiment: Sentiment

# Filtering function based on date range
def filter_by_date_range(content_list: List[UnclassifiedContent], date_start: datetime, date_end: datetime) -> List[UnclassifiedContent]:
    """
    Filter a list of UnclassifiedContent based on the date range.

    Args:
        content_list (List[UnclassifiedContent]): The list of unclassified content to filter.
        date_start (datetime): The start date of the range.
        date_end (datetime): The end date of the range.

    Returns:
        List[UnclassifiedContent]: The filtered list of content.
    """
    return [content for content in content_list if date_start <= content.date <= date_end]
