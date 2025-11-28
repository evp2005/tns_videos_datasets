from .ports.video_scraper import VideoScraper
from .ports.storage import AudioStorage
from .ports.repositories import UserRepository, VideoRepository, TranscriptionRepository
from .ports.content_fetcher import ContentFetcher
from .ports.youtube_service import YouTubeService
from typing import Tuple, Dict, Any

#from typing import Optional
import os
from .domain.models import User, Video, Transcription
from faster_whisper import WhisperModel
#NUEVAS LINEAS PARA DOBLAJE

import uuid
import tempfile
import shutil
from typing import Tuple, Dict, Any
from pydub import AudioSegment




from infrastructure.dubbing.audio.whisper_adapter import WhisperAudioAdapter
from infrastructure.dubbing.translation.google_translate_adapter import GoogleTranslateAdapter
from infrastructure.dubbing.tts.edge_tts_adapter import EdgeTTSAdapter




class VideoProcessingError(Exception):
    pass

class AuthenticationError(Exception):
    pass

class UserCreationError(Exception):
    pass

def get_escuelait_thumbnail_from_page(url: str, scraper: VideoScraper) -> str:
    """
    Caso de uso: Obtener la URL de la miniatura de una página de EscuelaIT.
    """
    thumbnail_url = scraper.get_thumbnail_url(url)
    if not thumbnail_url:
        raise VideoProcessingError("No se pudo encontrar la URL de la miniatura.")
    return thumbnail_url

def get_escuelait_title_from_page(url: str, scraper: VideoScraper) -> str:
    """
    Caso de uso: Obtener la URL del titulo de una página de EscuelaIT.
    """
    title_url = scraper.get_title_url(url)
    if not title_url:
        raise VideoProcessingError("No se pudo encontrar la URL del título.")
    return title_url

def get_escuelait_duration_from_page(url: str, scraper: VideoScraper) -> str:
    """
    Caso de uso: Obtener la URL del titulo de una página de EscuelaIT.
    """
    duration_url = scraper.get_duration_url(url)
    if not duration_url:
        raise VideoProcessingError("No se pudo encontrar la URL del título.")
    return duration_url

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

def create_video(title: str, origin_video: str, duration: str, language: str, url_video: str, user_id: int, user_repo: UserRepository, video_repo: VideoRepository, miniature: str = "") -> Video:
    """
    Caso de uso: Crear un nuevo video.
    """
    user = user_repo.get_by_id(user_id)
    if not user:
        raise UserCreationError(f"Usuario con ID {user_id} no encontrado para asociar al video.")

    video = video_repo.create(title, origin_video, duration, language, url_video, miniature, user)
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

def get_escuelait_details(url: str, scraper: VideoScraper) -> dict:
    """
    Caso de uso: Obtener los detalles de un video de EscuelaIT (título, duración, miniatura).
    Orquesta múltiples llamadas del scraper.
    """
    try:
        details = scraper.get_video_details(url)
        if not details:
            raise VideoProcessingError("No se pudieron obtener los detalles del video de EscuelaIT.")
        
        # Aquí podrías añadir más lógica si fuera necesario, como validar los datos.
        
        return details
    except Exception as e:
        # Re-lanzamos la excepción para que la vista la maneje.
        raise VideoProcessingError(f"Error al procesar la URL de EscuelaIT: {e}")





# DOBLAJE HFJKHSDJFHJKEHFHSEDHFS
class DubbingService:
    def __init__(self):
        self.audio_processor = WhisperAudioAdapter()
        self.translator = GoogleTranslateAdapter()
        self.voice_synthesizer = EdgeTTSAdapter()
        self.upload_dir = "uploads"
        self.output_dir = "outputs"
        self._ensure_directories()
    
    def _ensure_directories(self):
        os.makedirs(self.upload_dir, exist_ok=True)
        os.makedirs(self.output_dir, exist_ok=True)
    
    def is_dubbing_available(self) -> bool:
        return self.audio_processor.is_available()
    
    def is_whisper_loaded(self) -> bool:
        return self.audio_processor.is_whisper_loaded()
    
    def get_output_path(self, filename: str) -> str:
        return os.path.join(self.output_dir, filename)
    
    def process_dubbing(self, file_data: bytes, filename: str, source_lang: str, 
                       target_lang: str, use_edge_tts: bool) -> Tuple[bool, Dict[str, Any]]:
        try:

            print(f" DubbingService.process_dubbing iniciado")
            print(f" Archivo: {filename} ({len(file_data)} bytes)")
            print(f" Traducción: {source_lang} -> {target_lang}")


            # Guardar archivo temporalmente
            video_id = str(uuid.uuid4())
            file_extension = os.path.splitext(filename)[1] or ".mp4"
            unique_filename = f"{video_id}{file_extension}"
            file_path = os.path.join(self.upload_dir, unique_filename)
            
            print(f" Guardando archivo temporal: {file_path}")
            with open(file_path, 'wb') as f:
                f.write(file_data)
            
            # Procesar doblaje
            output_filename = f"dubbed_precise_{unique_filename}"
            output_path = os.path.join(self.output_dir, output_filename)
            
            success, result_info = self._process_dubbing_precise(
                file_path, output_path, source_lang, target_lang, use_edge_tts
            )
            
            if success:
                result_info["output_filename"] = output_filename
            
            return success, result_info
            
        except Exception as e:
            print(f" ERROR en DubbingService.process_dubbing: {str(e)}")
            import traceback
            traceback.print_exc()
            return False, {"error": str(e)}
    
    def _process_dubbing_precise(self, input_path: str, output_path: str, source_lang: str, 
                               target_lang: str, use_edge_tts: bool) -> Tuple[bool, Dict[str, Any]]:
        try:
            print(" Iniciando doblaje preciso...")
            temp_dir = tempfile.mkdtemp()
            
            try:
                # 1. Extraer audio del video usando FFmpeg
                print(" Extrayendo audio...")
                audio_path = os.path.join(temp_dir, "audio_original.wav")
                if not self.audio_processor.extract_audio(input_path, audio_path):
                    return False, {"error": "Error extrayendo audio"}
                
                # 2. Transcripción precisa con Whisper (con timestamps)
                print(" Transcribiendo con Whisper...")
                segments = self.audio_processor.transcribe_audio(audio_path, source_lang)
                
                if not segments:
                    return False, {"error": "No se pudo transcribir el audio"}
                
                print(f" Transcritos {len(segments)} segmentos")
                
                # 3. Procesar cada segmento con timing exacto
                print(" Procesando segmentos...")
                segmentos_procesados = []
                
                for i, segment in enumerate(segments):
                    if i % 5 == 0:  # Log cada 5 segmentos para no saturar
                        print(f"   Segmento {i+1}/{len(segments)}...")
                    
                    # Traducir texto
                    texto_traducido = self.translator.translate_text(
                        segment['text'], source_lang, target_lang
                    )
                    
                    if texto_traducido and len(texto_traducido.strip()) > 0:
                        # Generar audio doblado
                        audio_segment_path = os.path.join(temp_dir, f"segment_{i}.mp3")
                        
                        success = self.voice_synthesizer.synthesize_speech(
                            texto_traducido, audio_segment_path, target_lang, use_edge_tts
                        )
                        
                        if success:
                            segmentos_procesados.append({
                                'start': segment['start'],
                                'end': segment['end'],
                                'audio_path': audio_segment_path,
                                'text_original': segment['text'],
                                'text_translated': texto_traducido
                            })
                
                print(f"  Procesados {len(segmentos_procesados)} segmentos para doblaje")
                
                if not segmentos_procesados:
                    return False, {"error": "No se pudo procesar ningún segmento de audio"}
                
                # 4. Crear pista de audio doblada con timing exacto
                print(" Construyendo pista de audio doblada...")
                audio_doblado_path = os.path.join(temp_dir, "audio_doblado.wav")
                if not self._construir_audio_doblado(segmentos_procesados, audio_doblado_path, 
                                                   self._obtener_duracion_audio(audio_path)):
                    return False, {"error": "Error construyendo audio doblado"}
                
                # 5. Reemplazar audio en video usando FFmpeg
                print(" Reemplazando audio en video...")
                if self.audio_processor.mix_audio_tracks(input_path, audio_doblado_path, output_path):
                    return True, {
                        "transcribed_segments": len(segments),
                        "translated_segments": len(segmentos_procesados),
                        "total_duration": self._obtener_duracion_audio(audio_path)
                    }
                else:
                    return False, {"error": "Error reemplazando audio"}
                    
            finally:
                # Limpiar directorio temporal
                shutil.rmtree(temp_dir, ignore_errors=True)
                        
        except Exception as e:
            print(f" Error en doblaje preciso: {e}")
            import traceback
            traceback.print_exc()
            return False, {"error": str(e)}
    
    def _construir_audio_doblado(self, segmentos, output_path, duracion_total):
        try:
            # Crear pista de silencio del mismo length que el original
            pista_final = AudioSegment.silent(duration=int(duracion_total * 1000))  # ms
            
            for segmento in segmentos:
                try:
                    # Verificar que el archivo de audio existe
                    if not os.path.exists(segmento['audio_path']):
                        print(f"  Archivo de audio no encontrado: {segmento['audio_path']}")
                        continue
                    
                    # Cargar audio doblado
                    audio_doblado = AudioSegment.from_file(segmento['audio_path'])
                    
                    # Calcular posición en milisegundos
                    start_ms = int(segmento['start'] * 1000)
                    
                    # Asegurar que no nos salgamos de los límites
                    if start_ms + len(audio_doblado) > len(pista_final):
                        # Recortar audio si es muy largo
                        audio_doblado = audio_doblado[:len(pista_final) - start_ms]
                    
                    # Superponer audio doblado en la posición correcta
                    pista_final = pista_final.overlay(audio_doblado, position=start_ms)
                    
                except Exception as e:
                    print(f"  Error procesando segmento: {e}")
                    continue
            
            # Exportar audio final
            pista_final.export(output_path, format="wav")
            return os.path.exists(output_path)
            
        except Exception as e:
            print(f" Error construyendo audio doblado: {e}")
            return False
    
    def _obtener_duracion_audio(self, audio_path):
        try:
            audio = AudioSegment.from_file(audio_path)
            return len(audio) / 1000.0  # Convertir a segundos
        except Exception as e:
            print(f"  Error obteniendo duración: {e}")
            return 0
