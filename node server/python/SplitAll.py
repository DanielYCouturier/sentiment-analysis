from sys import argv
from data_types import RequestParameters, Source, Sentiment, ContentParameters
from datetime import datetime
from BugzillaScraper import scrape_bugzilla
from typing import List
from AI_Interface import classify
from RedditScraper import scrape_reddit
from sentiment_logging import log
def split(request_paramaters: RequestParameters) -> ContentParameters:
    """
    Splits request parameters to scrape data from various sources and classify it.
    Args:
        request_parameters (RequestParameters): The parameters for querying different sources.
    Returns:
        List: A list of classified content based on the provided parameters.
    """
    output =[]
    if(Source.BUGZILLA in request_paramaters.websites):
        try:
            output+=scrape_bugzilla(request_paramaters.query,request_paramaters.date_start,request_paramaters.date_end)
        except Exception as e:
            log("SplitAll.split failed to get data from bugzilla")
            log(e)
    if(Source.REDDIT in request_paramaters.websites):
        try:
            output+=scrape_reddit(request_paramaters.query, 3, request_paramaters.date_start, request_paramaters.date_end)
        except Exception as e:
            log("SplitAll.split failed to get data from reddit")
            log(e)
    return [classify(item) for item in output]
if __name__=="__main__":
    test_params = RequestParameters(
        query=argv[1],
        date_start=datetime(2024,1,1),
        date_end=datetime(2025,1,1),
        websites=[Source.REDDIT,Source.BUGZILLA],
        sentiment=Sentiment.ALL
    )
    results = split(test_params)
    for result in results:
        print(result)