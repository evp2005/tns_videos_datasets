import datetime
import yt_dlp
from core.ports.youtube_service import YouTubeService
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import JSONFormatter, TextFormatter, WebVTTFormatter, SRTFormatter
from utils.text_utils import flatten_text_yt
from core.services import VideoProcessingError

class YouTubeTranscriptService(YouTubeService):
    """Implementación del puerto YouTubeService."""

    def get_transcript(self, video_id: str, format: str) -> str:
        try:
            print(f"YOUTUBE_SERVICE: Iniciando obtención de transcripción para video_id='{video_id}' en formato '{format}'.")
            print("YOUTUBE_SERVICE: Buscando transcripciones en idiomas ['es', 'en']...")
            transcript = YouTubeTranscriptApi().fetch(video_id, languages=['es', 'en'])
            print("YOUTUBE_SERVICE: Transcripción encontrada. Aplicando formato...")

            if format == 'json':
                formatter = JSONFormatter()
            elif format == 'vtt':
                formatter = WebVTTFormatter()
            elif format == 'srt':
                formatter = SRTFormatter()
            elif format == 'text':
                text_content = TextFormatter().format_transcript(transcript)
                print("YOUTUBE_SERVICE: Formato 'text' solicitado. Limpiando y aplanando texto.")
                return flatten_text_yt(text_content)
            else:
                raise ValueError(f"Formato de transcripción no soportado: {format}")

            formatted_transcript = formatter.format_transcript(transcript)
            print(f"YOUTUBE_SERVICE: Transcripción formateada a '{format}' con éxito.")
            return formatted_transcript
        except Exception as e:
            print(f"YOUTUBE_SERVICE ERROR en get_transcript: {e}")
            raise

    def get_video_details(self, url: str) -> dict:
        try:
            print(f"YOUTUBE_SERVICE: Obteniendo detalles del video para la URL: {url}")
            ydl_opts = {
                'quiet': True,
                'skip_download': True,
                'force_generic_extractor': True
            }
            
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                print("YOUTUBE_SERVICE: Extrayendo información con yt-dlp...")
                info = ydl.extract_info(url, download=False)
                print("YOUTUBE_SERVICE: Información extraída con éxito.")
                
                title = info.get('title', None)
                total_seconds = info.get('duration', 0)
                duration_string = str(datetime.timedelta(seconds=total_seconds))

                details = {
                    "title": title,
                    "duration_seconds": total_seconds,
                    "duration_string": duration_string
                }
                print(f"YOUTUBE_SERVICE: Detalles encontrados: Título='{title}', Duración='{duration_string}'")
                return details
        except Exception as e:
            print(f"YOUTUBE_SERVICE ERROR en get_video_details: {e}")
            raise

    def get_download_url(self, url: str) -> str | None:
        """
        Obtiene la URL de descarga directa de un video de YouTube usando yt-dlp.
        Esta es una solución mucho más robusta que pytube.
        """
        try:
            print(f"YOUTUBE_SERVICE (yt-dlp): Obteniendo información para: {url}")
            ydl_opts = {
                'quiet': True,
                'skip_download': True,
                'force_generic_extractor': True
            }
            
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)
                
                # Buscamos el mejor formato que sea un solo archivo MP4 con video y audio
                best_format = None
                for f in info.get('formats', []):
                    # 'vcodec' y 'acodec' no son 'none' y la extensión es mp4
                    if f.get('vcodec') != 'none' and f.get('acodec') != 'none' and f.get('ext') == 'mp4':
                        # Priorizamos resoluciones de 720p o la mejor disponible si no hay 720p
                        if not best_format or (f.get('height', 0) > best_format.get('height', 0) and f.get('height', 0) <= 720):
                            best_format = f
                
                if best_format:
                    download_url = best_format.get('url')
                    print(f"YOUTUBE_SERVICE (yt-dlp): Formato seleccionado con resolución {best_format.get('height')}p. URL encontrada.")
                    return download_url
                else:
                    print("YOUTUBE_SERVICE ERROR: No se encontró un formato de video MP4 compatible con yt-dlp.")
                    return None
        except Exception as e:
            print(f"YOUTUBE_SERVICE ERROR en get_download_url: {e}")
            raise VideoProcessingError(f"yt-dlp falló con el error: {e}")