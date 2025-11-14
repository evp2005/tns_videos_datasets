from abc import ABC, abstractmethod
from typing import Any

class YouTubeService(ABC):
    """Puerto para interactuar con servicios de YouTube."""

    @abstractmethod
    def get_transcript(self, video_id: str, format: str) -> Any:
        """
        Obtiene la transcripción de un video de YouTube en un formato específico.
        Formatos posibles: 'json', 'vtt', 'srt', 'text'.
        """
        pass

    @abstractmethod
    def get_video_details(self, url: str) -> dict:
        """Obtiene los detalles (título, duración) de un video de YouTube."""
        pass
