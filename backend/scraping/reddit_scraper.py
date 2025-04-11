import praw
from dotenv import dotenv_values
from datetime import datetime
from scraping.data_types import UnclassifiedContent, filter_by_date_range, Source
from typing import List
class Post:
    """
    A data class representing individual reddit posts
    """
    def __init__(self, body, text, url, date, comments):
        self.body= body
        self.text = text
        self.url = url
        self.date = date
        self.comments = comments
    def __repr__(self):
        return f"Post(Title: {self.post}, Text: {len(self.text)}, # Comments: {len(self.comments)})"

def initilize_reddit() -> praw.Reddit:
    """
    Success:
        Initializes Reddit API using credentials from a .env file.
    Failure:
        Throws exception to be caught in parent class
    """
    env_vars = dotenv_values(".env")

    client_id = "REDACTED"
    client_secret = "REDACTED"
    user_agent = "REDACTED"

    reddit = praw.Reddit(
        client_id = client_id,
        client_secret = client_secret,
        user_agent = user_agent,
    )
    
    return reddit

def get_posts(company: str,parameters_limit:int = 100) -> List[Post]:
    """
    Success: 
        Returns all posts from reddit matching search_term
    Failure: 
        Individual posts or comments that cannot be parsed are thrown out
    """
    posts = [] 
    reddit = initilize_reddit()
    subreddit = reddit.subreddit(company)
    for submission in subreddit.search(company, limit=parameters_limit, sort='top', time_filter='all'):
        if not submission.stickied and submission.is_self:
            normalized_title = submission.title.lower()
            if company in normalized_title:
                post = Post(
                    body=submission.title,
                    text=submission.selftext,
                    url=submission.url,
                    date=submission.created_utc,
                    comments=list(submission.comments)
                )
                posts.append(post)
    return posts

def posts_to_content(post_list: List[Post]) -> List[UnclassifiedContent]:
    """
    Success:
        List of reddit posts is parsed into list of content objects
    Failure:
        Individual results that cannot be parsed are thrown out
    """
    unclassified_content_list = []
    for post in post_list:
        try:
            content_param = UnclassifiedContent(
                title=post.body,
                username ="N/A",
                content_body= post.text,
                date= datetime.fromtimestamp(post.date),
                source= Source.REDDIT,
                source_url=post.url
            )
            unclassified_content_list.append(content_param)
        except Exception:
            print("RedditScraper.posts_to_content failed to parse post: "+str(post))
    return unclassified_content_list

def scrape_reddit(search_term : str, parameter_limit: int, date_start: datetime, date_end: datetime) -> List[UnclassifiedContent]:
    """
    Scrape Reddit posts based on a search term and filter them by date range.
    Args:
        search_term (str): The search term to use in the query.
        parameters_limit (int): The number of posts to scrape. Defaults to 10.
        date_start (datetime): The start date for filtering posts.
        date_end (datetime): The end date for filtering posts.
    Returns:
        List[UnclassifiedContent]: A list of content objects that match the criteria.
    """
    posts = get_posts(search_term,parameter_limit)
    unclassified_content = posts_to_content(posts)
    unclassified_content = filter_by_date_range(unclassified_content,date_start,date_end)
    return unclassified_content
    