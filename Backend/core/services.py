from .ports.video_scraper import VideoScraper
from .ports.storage import AudioStorage
from .ports.repositories import UserRepository, VideoRepository, TranscriptionRepository
from .ports.content_fetcher import ContentFetcher
from .ports.youtube_service import YouTubeService
from typing import Optional
import os
from .domain.models import User, Video, Transcription
class VideoProcessingError(Exception):
    pass

class AuthenticationError(Exception):
    pass

class UserCreationError(Exception):
    pass

def get_texttrack_url_from_page(url: str, scraper: VideoScraper) -> str:
    """
    Caso de uso: Obtener la URL de los subtítulos de una página.
    """
    track_url = scraper.get_texttrack_url(url)
    if not track_url:
        raise VideoProcessingError("No se pudo encontrar la URL del texttrack.")
    return track_url

def get_m3u8_url_from_page(url: str, scraper: VideoScraper) -> str:
    """
    Caso de uso: Obtener la URL del M3U8 de una página.
    """
    m3u8_url = scraper.get_m3u8_url(url)
    if not m3u8_url:
        raise VideoProcessingError("No se pudo obtener la URL del M3U8.")
    return m3u8_url

def save_audio_from_url(m3u8_url: str, file_name: str, storage: AudioStorage) -> str:
    """
    Caso de uso: Guardar el audio desde una URL de M3U8.
    """
    saved_file = storage.save_audio_from_m3u8(m3u8_url, file_name)
    if not saved_file:
        raise VideoProcessingError("No se pudo guardar el archivo de audio.")
    return saved_file

def get_raw_content_from_url(url: str, fetcher: ContentFetcher) -> str:
    """Caso de uso: Obtener contenido crudo desde una URL."""
    content = fetcher.fetch_raw_content(url)
    if content is None:
        raise VideoProcessingError("No se pudo obtener el contenido de la URL.")
    return content

def register_user(username: str, email: str, password: str, user_repo: UserRepository) -> User:
    """
    Caso de uso: Registrar un nuevo usuario.
    """
    try:
        user = user_repo.create(username, email, password) # El repositorio se encarga del hash
        return user
    except Exception as e:
        # Podríamos tener validaciones, etc.
        raise UserCreationError(f"No se pudo crear el usuario: {e}")

def get_all_users(user_repo: UserRepository) -> list[User]:
    """
    Caso de uso: Obtener todos los usuarios.
    """
    return user_repo.get_all()

def create_video(title: str, origin_video: str, duration: str, language: str, url_video: str, user_id: int, user_repo: UserRepository, video_repo: VideoRepository) -> Video:
    """
    Caso de uso: Crear un nuevo video.
    """
    user = user_repo.get_by_id(user_id)
    if not user:
        raise UserCreationError(f"Usuario con ID {user_id} no encontrado para asociar al video.")

    video = video_repo.create(title, origin_video, duration, language, url_video, user)
    return video

def authenticate_user(email: str, password: str, user_repo: UserRepository) -> User:
    """
    Caso de uso: Autenticar un usuario.
    """
    user = user_repo.get_by_email(email)
    if not user:
        raise AuthenticationError("Usuario no encontrado")
    
    # El repositorio se encarga de verificar la contraseña
    if not user_repo.check_password(user.id, password):
        raise AuthenticationError("Contraseña incorrecta")
        
    return user

def transcribe_video(video_id: int, video_repo: VideoRepository, transcription_repo: TranscriptionRepository, audio_extractor, transcriber, media_root: str) -> Transcription:
    """
    Caso de uso: Transcribir un video.
    """
    video = video_repo.get_by_id(video_id)
    if not video or not video.video_path:
        raise VideoProcessingError("El video no fue encontrado o no tiene un archivo asociado.")

    video_full_path = os.path.join(media_root, video.video_path)
    
    audio_filename = f"{os.path.splitext(os.path.basename(video.video_path))[0]}.mp3"
    audio_output_path = os.path.join(media_root, 'audio', audio_filename)

    # 1. Extraer el audio (dependencia externa)
    extracted_audio_path = audio_extractor(video_full_path, audio_output_path)
    if not extracted_audio_path:
        raise VideoProcessingError("No se pudo extraer el audio del video.")

    # 2. Transcribir el audio (dependencia externa)
    transcript_text = transcriber(extracted_audio_path)

    # 3. Guardar la transcripción (usando el puerto de repositorio)
    transcription = transcription_repo.update_or_create(video, transcript_text)
    
    os.remove(extracted_audio_path) # Limpieza
    return transcription

def get_youtube_transcript(video_id: str, format: str, youtube_service: YouTubeService) -> str:
    """Caso de uso: Obtener transcripción de YouTube."""
    return youtube_service.get_transcript(video_id, format)

def get_youtube_details(url: str, youtube_service: YouTubeService) -> dict:
    """Caso de uso: Obtener detalles de un video de YouTube."""
    return youtube_service.get_video_details(url)
