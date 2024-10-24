from sys import argv
from data_types import RequestParameters, Source, Sentiment
from datetime import datetime
from BugzillaScraper import scrape_bugzilla
from typing import List
from AI_Interface import classify

def split(request_paramaters: RequestParameters):
    output =[]
    if(Source.BUGZILLA in request_paramaters.websites):
        try:
            output+=scrape_bugzilla(request_paramaters.query,request_paramaters.date_start,request_paramaters.date_end)
        except Exception:
            pass #do not interfere with stdout
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