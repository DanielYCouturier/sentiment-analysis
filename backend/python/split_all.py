from sys import argv
from data_types import RequestParameters, Source, Sentiment, ContentParameters
from datetime import datetime
from typing import List
from ai_interface import classify, MODEL_SELECTION
from reddit_scraper import scrape_reddit
from bugzilla_scraper import scrape_bugzilla
from sentiment_logging import log

def split(request_parameters: RequestParameters, model: str) -> List[ContentParameters]:
    """Splits request parameters to scrape data from various sources and classify it."""
    output = []
    if Source.BUGZILLA in request_parameters.websites:
        log("Scraping Bugzilla")
        output += scrape_bugzilla(request_parameters.query, request_parameters.date_start, request_parameters.date_end)
    if Source.REDDIT in request_parameters.websites:
        log("Scraping Reddit")
        output += scrape_reddit(request_parameters.query, 3, request_parameters.date_start, request_parameters.date_end)
    return [classify(item, model) for item in output]

if __name__ == "__main__":
    MODEL_SELECTION = argv[1] if len(argv) > 1 else "LOCAL"  # Default to LOCAL if no argument is provided
    log(f"Using model: {MODEL_SELECTION}")

    test_params = RequestParameters(
        query=argv[2] if len(argv) > 2 else "test",
        date_start=datetime(2024, 1, 1),
        date_end=datetime(2025, 1, 1),
        websites=[Source.REDDIT, Source.BUGZILLA],
        sentiment=Sentiment.ALL
    )
    results = split(test_params)
    for result in results:
        print(result)
