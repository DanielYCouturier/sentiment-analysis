import requests
import pandas as pd
from io import StringIO
from sys import argv
from typing import List
from data_types import UnclassifiedContent, filter_by_date_range
from datetime import datetime
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


# Function to scrape Bugzilla based on a search term
def get_data_frame(search_term):
    # Build the URL dynamically using the passed search term
    url = f'https://bugzilla-dev.allizom.org/buglist.cgi?quicksearch={search_term}&ctype=csv'

    response = requests.get(url)
    
    if response.status_code == 200:
        data_frame = pd.read_csv(StringIO(response.text))
    else:
        raise Exception(f"Failed to retrieve data from Bugzilla. Status Code: {response.status_code}")
    return data_frame

# Function to parse the CSV and create Bug objects for each row
def parse_csv(data_frame):
    bugs = []
    # Iterate through each row and create Bug objects
    for _, row in data_frame.iterrows():
        # Extract the relevant fields
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
    return bugs

def bug_to_content(bug_list: List[Bugzilla_Bug]):
    unclassified_content_list = []
    for bug in bug_list:
        try:
            content_param = UnclassifiedContent(
                username="Bug ID: "+str(bug.bug_id),
                content_body=bug.short_desc, 
                date=datetime.strptime(bug.changeddate, "%Y-%m-%d %H:%M:%S"),
                source_url='http://example.com',
            )
            unclassified_content_list.append(content_param)
        except Exception:
            pass #do not interfere with stdout
    return unclassified_content_list



def scrape_bugzilla(search_term, date_start: datetime, date_end: datetime):
    data_frame = get_data_frame(search_term)
    bug_list = parse_csv(data_frame)
    unclassified_content = bug_to_content(bug_list)
    return filter_by_date_range(unclassified_content,date_start,date_end)
# Example usage of the function
if __name__ == "__main__":
    bugs = scrape_bugzilla(argv[1], datetime(2023,1,1), datetime(2024,1,1))
    for bug in bugs:
        print(bug)