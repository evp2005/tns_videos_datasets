from requests import get, RequestException


def get_raw_content(url: str) -> str | None:
  try:
    req = get(url)
    req.raise_for_status()
    return req.text
  except RequestException:
    return None