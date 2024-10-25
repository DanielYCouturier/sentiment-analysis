from sys import argv
from data_types import RequestParameters, Source, Sentiment
from datetime import datetime
from BugzillaScraper import scrape_bugzilla
from RedditScraper import scrape_reddit, initialize_reddit
from AI_Interface import classify
from typing import List
import logging

# Set up basic logging configuration
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def split(request_parameters: RequestParameters) -> List:
    """
    Splits request parameters to scrape data from various sources and classify it.

    Args:
        request_parameters (RequestParameters): The parameters for querying different sources.

    Returns:
        List: A list of classified content based on the provided parameters.
    """
    output = []

    # Handle Bugzilla scraping
    if Source.BUGZILLA in request_parameters.websites:
        try:
            logging.info(f"Scraping Bugzilla for query: {request_parameters.query}")
            bugzilla_data = scrape_bugzilla(
                request_parameters.query,
                request_parameters.date_start,
                request_parameters.date_end
            )
            output += bugzilla_data
            logging.info(f"Bugzilla scraping complete. Total records: {len(bugzilla_data)}")
        except Exception as e:
            logging.error(f"Error scraping Bugzilla: {e}")

    # Handle Reddit scraping
    if Source.REDDIT in request_parameters.websites:
        try:
            logging.info(f"Initializing Reddit API and scraping for query: {request_parameters.query}")
            reddit_api = initialize_reddit()
            reddit_data = scrape_reddit(
                reddit_api,
                request_parameters.query,
                parameters_limit=10,  # You can modify this as needed
                parameter_time="week"
            )
            output += reddit_data
            logging.info(f"Reddit scraping complete. Total records: {len(reddit_data)}")
        except Exception as e:
            logging.error(f"Error scraping Reddit: {e}")

    # Classify the gathered content
    classified_content = [classify(item) for item in output]
    logging.info(f"Classification complete. Total classified records: {len(classified_content)}")

    return classified_content

if __name__ == "__main__":
    """
    Main entry point for the script. 
    Allows running the split function with command-line arguments for testing.
    """
    # Example testing parameters with command-line arguments for query
    try:
        query = argv[1]
        logging.info(f"Running split with query: {query}")

        test_params = RequestParameters(
            query=query,
            date_start=datetime(2024, 1, 1),
            date_end=datetime(2025, 1, 1),
            websites=[Source.REDDIT, Source.BUGZILLA],
            sentiment=Sentiment.ALL
        )

        # Run the split function
        results = split(test_params)
        for result in results:
            print(result)
    except IndexError:
        logging.error("Please provide a search query as a command-line argument.")
    except Exception as e:
        logging.error(f"An unexpected error occurred: {e}")
