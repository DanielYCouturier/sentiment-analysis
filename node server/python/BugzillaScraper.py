import requests
import pandas as pd
from io import StringIO
from typing import List
from data_types import UnclassifiedContent, filter_by_date_range
from datetime import datetime
import logging
import time

# Set up basic logging configuration
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

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
def get_data_frame(search_term: str) -> pd.DataFrame:
    """
    Fetch Bugzilla data using a search term and return it as a DataFrame.

    Args:
        search_term (str): The term to search for in Bugzilla.

    Returns:
        pd.DataFrame: A DataFrame containing bug data.
    """
    url = f'https://bugzilla.example.com/search?term={search_term}'  # Update with actual Bugzilla URL
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an HTTPError for bad responses
        logging.info(f"Successfully fetched data for search term: {search_term}")
    except requests.exceptions.RequestException as e:
        logging.error(f"Error occurred while fetching data from Bugzilla: {e}")
        return pd.DataFrame()  # Return an empty DataFrame in case of failure
    
    # Assuming the response contains CSV data
    try:
        data = StringIO(response.text)
        df = pd.read_csv(data)
        logging.info(f"Successfully parsed data for search term: {search_term}")
    except Exception as e:
        logging.error(f"Error parsing data: {e}")
        return pd.DataFrame()  # Return an empty DataFrame if parsing fails
    
    return df

# Function to scrape Bugzilla with pagination support
def scrape_bugzilla(search_term: str, date_start: datetime, date_end: datetime) -> List[Bugzilla_Bug]:
    """
    Scrape Bugzilla bugs based on a search term and filter them by date range.

    Args:
        search_term (str): The search term to use in Bugzilla.
        date_start (datetime): The start date for filtering bugs.
        date_end (datetime): The end date for filtering bugs.

    Returns:
        List[Bugzilla_Bug]: A list of Bugzilla_Bug objects that match the criteria.
    """
    url = f'https://bugzilla.example.com/search?term={search_term}&date_start={date_start.isoformat()}&date_end={date_end.isoformat()}'
    bugs = []
    
    while url:  # Handle pagination if multiple pages exist
        try:
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()
            for bug in data['bugs']:
                bug_obj = Bugzilla_Bug(
                    bug_id=bug['id'],
                    bug_type=bug['type'],
                    short_desc=bug['short_desc'],
                    product=bug['product'],
                    component=bug['component'],
                    assigned_to=bug['assigned_to'],
                    bug_status=bug['status'],
                    resolution=bug['resolution'],
                    changeddate=datetime.strptime(bug['changeddate'], '%Y-%m-%d')
                )
                if date_start <= bug_obj.changeddate <= date_end:
                    bugs.append(bug_obj)
            
            # Pagination: Check if there's a next page
            url = data.get('next_page', None)
            time.sleep(1)  # Sleep to avoid hitting rate limits
        except requests.exceptions.RequestException as e:
            logging.error(f"Error fetching data from Bugzilla: {e}")
            break
        except KeyError as e:
            logging.error(f"Missing expected data field: {e}")
            break

    logging.info(f"Total bugs fetched: {len(bugs)}")
    return bugs
