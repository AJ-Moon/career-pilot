import os
import re
import requests
from typing import Dict, Any, List

GITHUB_API_URL = "https://api.github.com"
HEADERS = {}

def extract_github_username(url: str) -> str:
    """
    Extract username from github.com URL
    """
    match = re.search(r"github\.com/([^/]+)", url)
    if not match:
        return None
    return match.group(1)


def fetch_github_profile(username: str) -> Dict[str, Any]:
    """
    Fetch basic user profile from GitHub API
    """
    resp = requests.get(f"{GITHUB_API_URL}/users/{username}", headers=HEADERS)
    resp.raise_for_status()
    return resp.json()


def fetch_github_repos(username: str, limit: int = 5) -> List[Dict[str, Any]]:
    """
    Fetch user repos (sorted by stargazers) and extract summary info
    """
    resp = requests.get(
        f"{GITHUB_API_URL}/users/{username}/repos?sort=updated&per_page=20",
        headers=HEADERS,
    )
    resp.raise_for_status()
    repos = resp.json()

    repo_data = []
    for repo in sorted(repos, key=lambda r: r["stargazers_count"], reverse=True)[:limit]:
        # fetching README
        readme_url = f"{GITHUB_API_URL}/repos/{username}/{repo['name']}/readme"
        readme_resp = requests.get(readme_url, headers=HEADERS)
        readme_text = ""
        if readme_resp.status_code == 200:
            readme_text = requests.get(readme_resp.json()["download_url"]).text

        repo_data.append(
            {
                "name": repo["name"],
                "description": repo.get("description"),
                "stars": repo["stargazers_count"],
                "language": repo.get("language"),
                "topics": repo.get("topics", []),
                "readme_excerpt": readme_text[:500],  # limit size
            }
        )
    return repo_data


def build_github_summary(url: str) -> Dict[str, Any]:
    """
    Given a GitHub URL, fetch user + repo data and build summary for AI
    """
    username = extract_github_username(url)
    if not username:
        return {"error": "Invalid GitHub URL"}

  
    try:
        profile = fetch_github_profile(username)
    except requests.exceptions.HTTPError as e:
        profile = {}
        print("GitHub fetch failed:", e)
    repos = fetch_github_repos(username)

    return {
        "username": username,
        "profile": {
            "name": profile.get("name"),
            "bio": profile.get("bio"),
            "company": profile.get("company"),
            "location": profile.get("location"),
            "public_repos": profile.get("public_repos"),
            "followers": profile.get("followers"),
        },
        "top_repos": repos,
    }
