from  datetime import datetime
import json
import sys
from data_types import *
from SplitAll import split
from typing import List

def debug_write_parameters_to_file(request_params: RequestParameters, filename: str):
    with open(filename, 'w') as f:
        f.write(str(type(request_params.query))+ " \""+request_params.query+"\"\n")
        f.write(str(type(request_params.date_start))+ " \""+str(request_params.date_start)+"\"\n")
        f.write(str(type(request_params.date_end))+ " \""+str(request_params.date_end)+"\"\n")
        f.write(str(type(request_params.websites))+ " \""+str(request_params.websites)+"\"\n")
        f.write(str(type(request_params.sentiment))+ " \""+str(request_params.sentiment)+"\"\n")

def global_return(content_list: List[ContentParameters]):
    content_dicts = [
        {
            "username": content.username,
            "content_body": content.content_body,
            "date": content.date.isoformat(),
            "source_url": content.source_url,
            "explicit": content.explicit,
            "sentiment": content.sentiment.value
        } 
        for content in content_list
    ]
    print(json.dumps(content_dicts))
    exit()

def main(query, date_start, date_end, sources, sentiment):
    date_format = "%Y-%m-%d"
    source = parse_source(sources)
    website_list = []
    if(source == Source.ALL):
        website_list = [Source.REDDIT,Source.BUGZILLA]
    else:
        website_list = [source]
    request_params = RequestParameters(
        query=query,
        date_start=datetime.strptime(date_start, date_format),
        date_end=datetime.strptime(date_end, date_format),
        websites=website_list,
        sentiment=parse_sentiment(sentiment)
    )
    content_list = split(request_params)
 
    global_return(content_list)

if __name__ == "__main__":
    query, date_start, date_end, sources, sentiment = json.loads(sys.argv[1])
    main(query, date_start, date_end, sources, sentiment)
