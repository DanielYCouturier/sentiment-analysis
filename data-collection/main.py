#this class is responsible for converting 
# between incoming http requests and a request_paramaters object
# and between a list of content paramaters object and outgoing http request 
from dataclasses import dataclass
@dataclass
# FINAL? data classes (any changes to these should be announced)
class request_paramaters:
    websites: list(str)
    date_start: datetime
    date_end: datetime
    query: list(str)
    sentiment: enum{POSITVE, NEGATIVE, NEUTRAL}

@dataclass
class content_paramaters:
    username: str
    date: datetime
    content_body: str
    source_url: str
    # explicit: boolean (for ai TODO later
    # sentiment: enum ( for ai TODO later)



def main():
    #init
    http_listener()


def http_listener():
    while(True):
        if(http_request):
            start_new_thread(parse_http(http_request))

def parse_http(http_request): 
    if(http_request is valid):
        user_paramters = parse(http_request) # type of request_paramaters
        output = list[content_paramaters] = split(paramaters)
        convert_to_http(output)
