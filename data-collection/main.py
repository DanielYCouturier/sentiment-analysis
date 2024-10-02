#this class is responsible for converting between data class request_paramaters and http requests

from dataclasses import dataclass
@dataclass
# TODO ASAP: DEFINE THESE CLASSES
class request_paramaters:
    website: str
    date_start: str
    date_end: str
    keywords: list

@dataclass
class content_paramaters:
    username: str
    date: str
    content_body: str



def main():
    #init
    http_listener()


def http_listener():
    while(True):
        if(http_request):
            start_new_thread(parse_http(http_request))

def parse_http(http_request):
    if(http_request is valid):
        query = request_paramaters(parse(http_request))
        sources = get_urls(query)
        output = list(content_paramaters)
        for(url, source) in sources:
            if(source==reddit):
                for content in scrape_reddit(url):
                    output.append(content)
            if(source==bugzilla):
                for content in scrape_bugzilla(url):
                    output.append(content)
        convert_to_http_response(output)