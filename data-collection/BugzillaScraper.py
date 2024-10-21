import requests
import pandas as pd
import os

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

    print("Sending request to Bugzilla...")
    response = requests.get(url)
    print(f"Response status code: {response.status_code}")
    
    # Get the directory of the current script
    current_directory = os.path.dirname(__file__)
    file_path = os.path.join(current_directory, 'bugs.csv')

    if response.status_code == 200:
        print("Successfully fetched data. Writing to file...")
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(response.text)

        # Verify the saved file
        if os.path.exists(file_path):
            print(f"File saved successfully at: {file_path}")
            print("Reading CSV content...")

            # Load CSV into pandas
            try:
                df = pd.read_csv(file_path)
                #print("CSV loaded successfully. Displaying the first few rows:")
                #print(df.head())
            except Exception as e:
                print(f"Error loading CSV: {e}")
        else:
            print("File was not saved.")
    else:
        print(f"Failed to retrieve data. Status code: {response.status_code}")
    return file_path

# Function to parse the CSV and create Bug objects for each row
def parse_csv(file_path):
    bugs = []
    try:
        # Load CSV data
        df = pd.read_csv(file_path)

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

        print(f"Parsed {len(bugs)} bugs.")
        return bugs

    except Exception as e:
        print(f"Error parsing CSV: {e}")

    return []

# Example usage of the function
if __name__ == "__main__":

    csv_file = scrape_bugzilla('google')

    if csv_file:
        # Parse the CSV file and print the bug details
        bugs = parse_csv(csv_file)
        for bug in bugs:
            print(bug)
