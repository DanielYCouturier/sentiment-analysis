import requests
import pandas as pd
from io import StringIO

# Define a class to hold bug details
class Bug:
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
def scrape_bugzilla(search_term):
    # Build the URL dynamically using the passed search term
    url = f'https://bugzilla-dev.allizom.org/buglist.cgi?quicksearch={search_term}&ctype=csv'

    response = requests.get(url)
    
    if response.status_code == 200:
        df = pd.read_csv(StringIO(response.text))
    else:
        raise Exception(f"Failed to retrieve data from Bugzilla. Status Code: {response.status_code}")
    return df

# Function to parse the CSV and create Bug objects for each row
def parse_csv(df):
    bugs = []
    # Iterate through each row and create Bug objects
    for _, row in df.iterrows():
        # Extract the relevant fields
        bug = Bug(
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

# Example usage of the function
if __name__ == "__main__":

    csv_file = scrape_bugzilla('google')
    bugs = parse_csv(csv_file)
    for bug in bugs:
        print(bug)