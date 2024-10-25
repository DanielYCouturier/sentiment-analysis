from datetime import datetime
import json
import sys
from data_types import RequestParameters, ContentParameters
from SplitAll import split
from typing import List
import logging

# Set up basic logging configuration
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def debug_write_parameters_to_file(request_params: RequestParameters, filename: str):
    """
    Write the request parameters to a file for debugging purposes.
    
    Args:
        request_params (RequestParameters): The request parameters to log.
        filename (str): The file path where to write the parameters.
    """
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(request_params.__dict__, f, default=str, indent=4)
        logging.info(f"Request parameters written to {filename}")
    except Exception as e:
        logging.error(f"Error writing request parameters to file: {e}")

def global_return(content_list: List[ContentParameters]) -> List[dict]:
    """
    Convert a list of ContentParameters to a list of dictionaries for returning as JSON.

    Args:
        content_list (List[ContentParameters]): List of classified content.

    Returns:
        List[dict]: A list of dictionaries representing the classified content.
    """
    content_dicts = [
        {
            "username": content.username,
            "content_body": content.content_body,
            "date": content.date.isoformat(),
            "source_url": content.source_url,
            "explicit": content.explicit,
            "sentiment": content.sentiment.value  # Convert Sentiment Enum to string
        }
        for content in content_list
    ]
    
    logging.info(f"Total content converted to dictionaries: {len(content_dicts)}")
    return content_dicts

if __name__ == "__main__":
    """
    Main execution for testing the script.
    Use command-line arguments to pass query terms and date range.
    """
    try:
        query = sys.argv[1]
        date_start = sys.argv[2] if len(sys.argv) > 2 else "2024-01-01"
        date_end = sys.argv[3] if len(sys.argv) > 3 else "2025-01-01"

        # Parse the dates
        date_start = datetime.strptime(date_start, "%Y-%m-%d")
        date_end = datetime.strptime(date_end, "%Y-%m-%d")

        logging.info(f"Running get_data.py with query: {query}, start date: {date_start}, end date: {date_end}")

        # Test parameters
        test_params = RequestParameters(
            query=query,
            date_start=date_start,
            date_end=date_end,
            websites=["REDDIT", "BUGZILLA"],
            sentiment="ALL"
        )

        # Write the parameters to a file for debugging
        debug_write_parameters_to_file(test_params, "request_parameters_debug.json")

        # Execute the split function to classify the content
        results = split(test_params)

        # Convert results to a JSON-friendly format
        output = global_return(results)

        # Print the results
        for result in output:
            print(result)
    except IndexError:
        logging.error("Please provide a search query as a command-line argument.")
    except Exception as e:
        logging.error(f"An unexpected error occurred: {e}")
