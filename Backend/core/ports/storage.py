from abc import ABC, abstractmethod

class AudioStorage(ABC):
    """Puerto para guardar archivos de audio."""

    @abstractmethod
    def save_audio_from_m3u8(self, m3u8_url: str, file_name: str) -> str:
        """Guarda el audio y devuelve la ruta o nombre final del archivo."""
        pass
