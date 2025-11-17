from abc import ABC, abstractmethod

class ContentFetcher(ABC):
    """Puerto para obtener contenido crudo desde una URL."""

    @abstractmethod
    def fetch_raw_content(self, url: str) -> str | None:
        """Obtiene el contenido de una URL como una cadena de texto."""
        pass
