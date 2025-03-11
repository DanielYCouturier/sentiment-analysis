from sys import argv
from scraping.data_types import RequestParameters, Source, Sentiment, UnclassifiedContent
from datetime import datetime
from typing import List
from scraping.reddit_scraper import scrape_reddit
from scraping.bugzilla_scraper import scrape_bugzilla

def split(request_parameters: RequestParameters, model: str) -> List[UnclassifiedContent]:
    """Splits request parameters to scrape data from various sources and classify it."""
    output = []
    if Source.BUGZILLA in request_parameters.websites:
        print("Scraping Bugzilla")
        try:
            output += scrape_bugzilla(request_parameters.query, request_parameters.date_start, request_parameters.date_end)
        except Exception as error:
            print("Error Scraping Bugzilla"+str(error))
    if Source.REDDIT in request_parameters.websites:
        print("Scraping Reddit")
        try:
            output += scrape_reddit(request_parameters.query, 3, request_parameters.date_start, request_parameters.date_end)
        except Exception as error:
            print("Error Scraping Reddit"+str(error))
    return output

if __name__ == "__main__":
    MODEL_SELECTION = argv[1] if len(argv) > 1 else "LOCAL"  # Default to LOCAL if no argument is provided
    print(f"Using model: {MODEL_SELECTION}")

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
