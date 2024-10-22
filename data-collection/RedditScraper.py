import praw
import requests
from dotenv import dotenv_values

class Post:
    def __init__(self, post, text, url, date, comments):
        self.post = post
        self.text = text
        self.url = url
        self.date = date
        self.comments = comments

    def __repr__(self):
        return f"Post(Title: {self.post}, Text: {len(self.text)}, # Comments: {len(self.comments)})"

def initilize_reddit(): # An api key is need can share mine later
    env_vars = dotenv_values(".env")

    client_id = env_vars.get("client_id")
    client_secret = env_vars.get("client_secret")
    user_agent = env_vars.get("user_agent")

    reddit = praw.Reddit(
        client_id = client_id,
        client_secret = client_secret,
        user_agent = user_agent,
    )
    
    return reddit

def scrape_reddit(reddit,company,parameters_limit,parameter_time): #TODO DEFINE PARAMETERS
    posts = [] # posts
    subreddit = reddit.subreddit(company)
    for submission in subreddit.new(limit=parameters_limit):

        all_text = []
        submission.comments.replace_more(limit=0)
        for comment in submission.comments.list():
            all_text.append(comment.body) # comment
        
        post = Post(
                post = submission.title,
                text = submission.selftext,
                url = submission.url,
                date = submission.created,
                comments = all_text
                )
        posts.append(post)

    return posts

if __name__ == "__main__":
    reddit = initilize_reddit()
    parameter_limit = 25
    parameter_time = "year"
    posts = scrape_reddit(reddit,"netflix",parameter_limit,parameter_time)

    for post in posts:
        print(post)
