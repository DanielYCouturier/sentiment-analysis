import praw
import requests
from dotenv import dotenv_values
import logging
import time
from typing import List

# Set up basic logging configuration
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class Post:
    def __init__(self, post, text, url, date, comments):
        self.post = post
        self.text = text
        self.url = url
        self.date = date
        self.comments = comments

    def __repr__(self):
        return f"Post(Title: {self.post}, Text: {len(self.text)} characters, # Comments: {len(self.comments)})"

def initialize_reddit() -> praw.Reddit:
    """
    Initialize Reddit API using credentials from a .env file.
    
    Returns:
        praw.Reddit: An authenticated Reddit API instance.
    """
    try:
        env_vars = dotenv_values(".env")
        client_id = env_vars["client_id"]
        client_secret = env_vars["client_secret"]
        user_agent = env_vars["user_agent"]
        logging.info("Reddit API credentials loaded successfully")
    except KeyError as e:
        logging.error(f"Missing environment variable: {e}")
        raise ValueError(f"Missing environment variable: {e}")

    return praw.Reddit(client_id=client_id, client_secret=client_secret, user_agent=user_agent)

def scrape_reddit(reddit: praw.Reddit, subreddit_name: str, parameters_limit: int = 10, parameter_time: str = "week") -> List[Post]:
    """
    Scrape posts from a specified subreddit.

    Args:
        reddit (praw.Reddit): An authenticated Reddit instance.
        subreddit_name (str): The name of the subreddit to scrape.
        parameters_limit (int): The number of posts to scrape. Defaults to 10.
        parameter_time (str): The time filter for posts (e.g., "day", "week"). Defaults to "week".

    Returns:
        List[Post]: A list of Post objects scraped from the subreddit.
    """
    posts = []
    
    try:
        subreddit = reddit.subreddit(subreddit_name)
        for submission in subreddit.new(limit=parameters_limit):
            post = Post(
                post=submission.title,
                text=submission.selftext,
                url=submission.url,
                date=submission.created_utc,
                comments=list(submission.comments)
            )
            posts.append(post)
            logging.info(f"Scraped post: {post}")
            time.sleep(1)  # Add a delay to avoid rate limiting
    except praw.exceptions.RequestException as e:
        logging.error(f"Error fetching data from Reddit: {e}")
    except Exception as e:
        logging.error(f"An unexpected error occurred: {e}")

    logging.info(f"Total posts scraped: {len(posts)}")
    return posts
