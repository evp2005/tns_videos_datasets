from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.remote.webdriver import WebDriver, WebElement, ShadowRoot
from json import loads
from typing import Any


def get_chrome_driver() -> WebDriver:
  options = webdriver.ChromeOptions()
  options.add_argument(r"--user-data-dir=C:\selenium-profile")
  options.add_argument("--profile-directory=Default")
  options.add_argument("--restore-last-session=false")
  options.add_argument("--no-first-run")
  return webdriver.Chrome(options=options)


def get_iframe_video(driver: WebDriver) -> WebElement | None:
  try:
    shadow_host: WebElement = driver.find_element(By.CSS_SELECTOR, ".Clase-video > eit-player")
    shadow_root: ShadowRoot = shadow_host.shadow_root
    return shadow_root.find_element(By.CSS_SELECTOR, "iframe#video")
  except NoSuchElementException:
    return None


def get_track_src(driver: WebDriver) -> str | None:
  try:
    element: WebElement = driver.find_element(By.CSS_SELECTOR, "track")
    return element.get_attribute("src")
  except NoSuchElementException:
    return None


def get_scripts(driver: WebDriver) -> list[WebElement]:
  scripts = driver.find_elements(By.TAG_NAME, "script")
  return [script for script in scripts]


def get_player_config_from_script(script: WebElement) -> None | Any:
  player_config = None
  content = script.get_attribute("innerHTML")
  if content and "window.playerConfig" in content:
    start = content.find("{")
    end = content.rfind("}") + 1
    json_str = content[start:end]
    player_config = loads(json_str)
  return player_config


def get_meu8_url_using_player_config(player_config: dict[str, Any]) -> str | None:
  try:
    return player_config["request"]["files"]["hls"]["cdns"]["akfire_interconnect_quic"]["avc_url"]
  except (KeyError, TypeError):
    return None