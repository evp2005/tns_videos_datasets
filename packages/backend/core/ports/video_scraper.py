from abc import ABC, abstractmethod

class VideoScraper(ABC):
    """Puerto para obtener información de video desde una URL."""

    @abstractmethod
    def get_texttrack_url(self, url: str) -> str | None:
        """Obtiene la URL del VTT."""
        pass

    @abstractmethod
    def get_m3u8_url(self, url: str) -> str | None:
        """Obtiene la URL del m3u8."""
        pass
