import datetime
import yt_dlp
from core.ports.youtube_service import YouTubeService
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import JSONFormatter, TextFormatter, WebVTTFormatter, SRTFormatter
from utils.text_utils import flatten_text_yt

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