from core.ports.content_fetcher import ContentFetcher
from utils import http_utils

class HTTPContentFetcher(ContentFetcher):
    """Implementación de ContentFetcher usando peticiones HTTP."""

    def fetch_raw_content(self, url: str) -> str | None:
        return http_utils.get_raw_content(url)