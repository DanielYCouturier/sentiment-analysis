import requests
import pandas as pd
from io import StringIO
from sys import argv
from typing import List
from data_types import UnclassifiedContent, filter_by_date_range
from datetime import datetime
from sentiment_logging import log
# Define a class to hold bug details
class Bugzilla_Bug:
    def __init__(self, bug_id, bug_type, short_desc, product, component, assigned_to, bug_status, resolution, changeddate):
        self.bug_id = bug_id
        self.bug_type = bug_type
        self.short_desc = short_desc
        self.product = product
        self.component = component
        self.assigned_to = assigned_to
        self.bug_status = bug_status
        self.resolution = resolution
        self.changeddate = changeddate

    def __repr__(self):
        return f"Bug(ID: {self.bug_id}, Summary: {self.short_desc}, Status: {self.bug_status})"


def get_data_frame(search_term: str) -> pd.DataFrame:
    """
    Success:
        Fetch Bugzilla data using a search term and return it as a DataFrame.
    Failure:
        Throws exception to be caught in parent class
    """
    url = f'https://bugzilla-dev.allizom.org/buglist.cgi?quicksearch={search_term}&ctype=csv'

    response = requests.get(url)
    
    if response.status_code == 200:
        data_frame = pd.read_csv(StringIO(response.text))
    else:
        raise Exception(f"Failed to retrieve data from Bugzilla. Status Code: {response.status_code}")
    return data_frame

def parse_csv(data_frame: pd.DataFrame) -> List[Bugzilla_Bug]:
    """
    Success:
        All rows of CSV are  parsed into list of bugzilla bugs.
    Failure:
        Individual results that cannot be parsed are thrown out.
    """
    bugs = []
    for _, row in data_frame.iterrows():
        try:
            bug = Bugzilla_Bug(
                bug_id=row['bug_id'],
                bug_type=row['bug_type'],
                short_desc=row['short_desc'],
                product=row['product'],
                component=row['component'],
                assigned_to=row['assigned_to'],
                bug_status=row['bug_status'],
                resolution=row['resolution'],
                changeddate=row['changeddate']
                )
            bugs.append(bug)
        except Exception as e:
            log("BugzillaScraper.parse_csv failed to parse row: "+ str(row))
    return bugs

def bug_to_content(bug_list: List[Bugzilla_Bug]) -> List[UnclassifiedContent]:
    """
    Success:
        List of bugzilla bugs are parsed into list of content objects
    Failure:
        Individual results that cannot be parsed are thrown out
    """
    unclassified_content_list = []
    for bug in bug_list:
        try:
            content_param = UnclassifiedContent(
                title="Bug ID: "+str(bug.bug_id),
                username="N/A",
                content_body=bug.short_desc, 
                date=datetime.strptime(bug.changeddate, "%Y-%m-%d %H:%M:%S"),
                source_url='http://example.com',
            )
            unclassified_content_list.append(content_param)
        except Exception:
            log("BugzillaScraper.parse_csv failed to parse bug: "+ str(bug))
    return unclassified_content_list



def scrape_bugzilla(search_term: str, date_start: datetime, date_end: datetime) -> List[UnclassifiedContent]:
    """
    Scrape Bugzilla bugs based on query paramaters.
    Args:
        search_term (str): The search term to use in Bugzilla.
        date_start (datetime): The start date for filtering bugs.
        date_end (datetime): The end date for filtering bugs.
    Returns:
        List[UnclassifiedContent]: A list of bugs that match the criteria.
    """

    data_frame = get_data_frame(search_term)
    bug_list = parse_csv(data_frame)
    unclassified_content = bug_to_content(bug_list)
    return filter_by_date_range(unclassified_content,date_start,date_end)
# Example usage of the function
if __name__ == "__main__":
    bugs = scrape_bugzilla(argv[1], datetime(2023,1,1), datetime(2024,1,1))
    for bug in bugs:
        print(bug)