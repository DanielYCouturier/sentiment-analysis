from data_types import *
from typing import List
# this class is responsible for interpreting the user query as relavent calls to RedditScraper.py and BugzillaScraper.py
# potentially use google api/scraping to find relavent urls or other parameters?
# potentially use reddit/bugzilla searches to find?
# potentially other method?

#eg if paramaters.query == "ms outlook" and paramters with paramters.websites == ["Reddit"],
# then ScrapeReddit() should be called for each subreddit r/Outlook, and MAYBE r/Microsoft, and pass remaining paramaters.
# importantly, if websites.contains(all), appropriate logic

def split(request_paramaters):
    output = List[RequestParameters]
    # if(request_source contains reddit)
    # output.appendAll(scrape_reddit(subreddit, request_paramaters))
    # if(request_source contans bugzilla)
    # output.appendAll(scrape_bugzilla(subpage, request_paramaters))
    # if(request_source contains bugzilla and reddit)
    # output.appendAll(scrape_reddit(subreddit, request_paramaters))
    # output.appendAll(scrape_bugzilla(subpage, request_paramaters))


    return output