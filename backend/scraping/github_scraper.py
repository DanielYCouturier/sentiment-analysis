import requests
from selenium import webdriver # type:ignore
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.common.exceptions import StaleElementReferenceException
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service # type:ignore
from webdriver_manager.chrome import ChromeDriverManager # type:ignore
from selenium.webdriver.chrome.options import Options # type:ignore
from selenium.webdriver.common.keys import Keys # type:ignore

class Issue:
    def __init__(self, header, body, user, opened, link):
        self.header = header 
        self.body = body 
        self.user = user
        self.opened = opened
        self.link = link
    def __repr__(self):
        return f"Issue(Header: {self.header}, Body: {self.body}, Link: {self.link})"

def create_driver():
    # Options chosen specifically for use in a docker container
    options = Options()
    options.add_argument("--no-sandbox")
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
        
    return driver

def pull_issues(start, end, parameter_limit, company, driver):
    
    results = []
    wait = WebDriverWait(driver, 10)
    driver.get(f"https://github.com/search?q={company}&type=issues")
    next_button = driver.find_element("xpath", "/html/body/div[1]/div[4]/main/react-app/div/div/div[1]/div/div/div[2]/div[2]/div/div[1]/div[5]/div/nav/div/a[9]")

    while len(results) <= parameter_limit:
        issues = driver.find_element(By.CSS_SELECTOR, "body > div.logged-out.env-production.page-responsive > div.application-main > main > react-app > div > div > div.Box-sc-g0xbh4-0.dKXtYX > div > div > div.Box-sc-g0xbh4-0.dsxbXg > div.Box-sc-g0xbh4-0.FxAyp > div > div.Box-sc-g0xbh4-0.insNpl > div.Box-sc-g0xbh4-0.JcuiZ > div > div")
        issues_list = issues.find_elements(By.CSS_SELECTOR, "body > div.logged-out.env-production.page-responsive > div.application-main > main > react-app > div > div > div.Box-sc-g0xbh4-0.dKXtYX > div > div > div.Box-sc-g0xbh4-0.dsxbXg > div.Box-sc-g0xbh4-0.FxAyp > div > div.Box-sc-g0xbh4-0.insNpl > div.Box-sc-g0xbh4-0.JcuiZ > div > div > div")

        for issue in issues_list:
            text = issue.text.split("\n")
            link = f"https://github.com/{text[0]}"
            header = text[1]
            if (text[3] == "·"):
                body = "none"
                user = text[2]
                opened = text[5]
            else:
                body = text[2]
                user = text[3]
                opened = text[6]

            results.append(Issue(header, body, user, opened, link))

            if len(results) == parameter_limit:
                return results

        while __check_element__(next_button):
           wait.until(EC.element_to_be_clickable(next_button))
           next_button.click()
           print("button clicked")

def __check_element__(element):
    try:
        element.get_attribute("span")
    except StaleElementReferenceException:
        return False
    return True

if __name__ == "__main__":
    driver = create_driver()
    issues = pull_issues("any", "any", 25, "netflix", driver)
    for issue in issues:
        print(issue)
    print(len(issues))
