from .ports.video_scraper import VideoScraper
from .ports.storage import AudioStorage
from ..models import Video  # Importamos el modelo ORM de Django

# Excepción personalizada para el dominio
class VideoProcessingError(Exception):
    pass

def get_texttrack_url_from_page(url: str, scraper: VideoScraper) -> str:
    """
    Caso de uso: Obtener la URL de los subtítulos de una página.
    """
    track_url = scraper.get_texttrack_url(url)
    if not track_url:
        raise VideoProcessingError("No se pudo encontrar la URL del texttrack.")
    return track_url

def save_audio_from_escuelait_url(url: str, file_name: str, scraper: VideoScraper, storage: AudioStorage) -> str:
    """
    Caso de uso: Obtener y guardar el audio de una URL de EscuelaIT.
    """
    m3u8_url = scraper.get_m3u8_url(url)
    if not m3u8_url:
        raise VideoProcessingError("No se pudo obtener la URL del M3U8.")
    
    saved_file = storage.save_audio_from_m3u8(m3u8_url, file_name)
    if not saved_file:
        raise VideoProcessingError("No se pudo guardar el archivo de audio.")

    return saved_file
