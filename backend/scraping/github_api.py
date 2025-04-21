import requests
import pandas as pd
from sys import argv
from typing import List
from scraping.data_types import UnclassifiedContent, Source
from datetime import datetime

GITHUB_API = "https://api.github.com"

class GitHub_Bug:
    def __init__(self, issue_id, title, body, repository, assigned_to, status, created_at, url):
        self.issue_id = issue_id
        self.title = title
        self.body = body
        self.repository = repository
        self.assigned_to = assigned_to
        self.status = status
        self.created_at = created_at
        self.url = url

    def __repr__(self):
        return f"GitHub Issue(ID: {self.issue_id}, Title: {self.title}, Status: {self.status})"


def search_repository(search_term: str) -> str:
    url = f"{GITHUB_API}/search/repositories"
    params = {"q": search_term, "sort": "stars", "order": "desc", "per_page": 1}
    response = requests.get(url, params=params)

    if response.status_code == 200:
        items = response.json().get("items", [])
        return items[0]["full_name"] if items else None
    else:
        raise Exception(f"Failed to search GitHub repositories. Status Code: {response.status_code}")


def get_data_frame(repo_full_name: str, date_start: datetime, date_end: datetime) -> pd.DataFrame:
    url = f"{GITHUB_API}/repos/{repo_full_name}/issues"
    params = {
        "labels": "bug",
        "per_page": 100,
        "state": "all",
        "since": date_start.strftime("%Y-%m-%dT%H:%M:%SZ"),
    }
    headers = {
        "Accept": "application/vnd.github.v3+json"
    }
    
    all_issues = []
    page = 1

    while True:
        params["page"] = page
        try:
            response = requests.get(url, params=params, headers=headers)

            if response.status_code != 200:
                print(f"Warning: Failed to retrieve page {page} (status code {response.status_code}). Skipping.")
                page += 1
                break

            issues = response.json()
            if not issues:
                continue

            # Log the first issue's created_at for debug
            print(f"[Page {page}] First issue created at: {issues[0]['created_at']}")

            # Filter issues within the desired date range
            filtered_issues = [
                {
                    "issue_id": issue["id"],
                    "title": issue["title"],
                    "body": issue.get("body", "No description"),
                    "repository": repo_full_name,
                    "assigned_to": issue["assignee"]["login"] if issue["assignee"] else "Unassigned",
                    "status": issue["state"],
                    "created_at": issue["created_at"],
                    "url": issue["html_url"],
                }
                for issue in issues
                if date_start <= datetime.strptime(issue["created_at"], "%Y-%m-%dT%H:%M:%SZ") <= date_end
            ]

            all_issues.extend(filtered_issues)

            # Stop if all issues on this page are before the date range
            last_issue_date = datetime.strptime(issues[-1]["created_at"], "%Y-%m-%dT%H:%M:%SZ")
            if last_issue_date < date_start:
                break

            page += 1

        except Exception as e:
            print(f"Error parsing page {page}: {e}")
            page += 1
            break

    return pd.DataFrame(all_issues)

def parse_issues(data_frame: pd.DataFrame) -> List[GitHub_Bug]:
    bugs = []
    for _, row in data_frame.iterrows():
        try:
            bug = GitHub_Bug(
                issue_id=row["issue_id"],
                title=row["title"],
                body=row["body"],
                repository=row["repository"],
                assigned_to=row["assigned_to"],
                status=row["status"],
                created_at=row["created_at"],
                url=row["url"],
            )
            bugs.append(bug)
        except Exception as e:
            print("GitHubScraper.parse_issues failed to parse row:", row)
    return bugs


def bug_to_content(bug_list: List[GitHub_Bug]) -> List[UnclassifiedContent]:
    """
    Convert GitHub_Bug objects into UnclassifiedContent objects.
    """
    unclassified_content_list = []
    for bug in bug_list:
        try:
            content_param = UnclassifiedContent(
                title="GitHub Issue: " + str(bug.issue_id),
                username=bug.assigned_to,
                content_body=bug.body or "",
                date=datetime.strptime(bug.created_at, "%Y-%m-%dT%H:%M:%SZ"),
                source=Source.GITHUB,
                source_url=bug.url,
            )
            unclassified_content_list.append(content_param)
        except Exception:
            print("GitHubScraper.bug_to_content failed to parse bug:", bug)
    return unclassified_content_list


def scrape_github(search_term: str, date_start: datetime, date_end: datetime) -> List[UnclassifiedContent]:
    repo_name = search_repository(search_term)
    if not repo_name:
        return []
    data_frame = get_data_frame(repo_name, date_start, date_end)
    bug_list = parse_issues(data_frame)
    unclassified_content = bug_to_content(bug_list)
    return unclassified_content


if __name__ == "__main__":
    bugs = scrape_github(argv[1], datetime(2023, 1, 1), datetime(2024, 1, 1))
    for bug in bugs:
        print(bug)
