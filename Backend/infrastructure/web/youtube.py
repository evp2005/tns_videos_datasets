import datetime
import yt_dlp
from core.ports.youtube_service import YouTubeService
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import JSONFormatter, TextFormatter, WebVTTFormatter, SRTFormatter
from utils.text_utils import flatten_text_yt

class YouTubeTranscriptService(YouTubeService):
    """Implementación del puerto YouTubeService."""

    def get_transcript(self, video_id: str, format: str) -> str:
        transcript = YouTubeTranscriptApi().fetch(video_id, languages=['es', 'en'])

        if format == 'json':
            formatter = JSONFormatter()
        elif format == 'vtt':
            formatter = WebVTTFormatter()
        elif format == 'srt':
            formatter = SRTFormatter()
        elif format == 'text':
            text_content = TextFormatter().format_transcript(transcript)
            return flatten_text_yt(text_content)
        else:
            raise ValueError("Formato de transcripción no soportado.")

        return formatter.format_transcript(transcript)

    def get_video_details(self, url: str) -> dict:
        ydl_opts = {
            'quiet': True,
            'skip_download': True,
            'force_generic_extractor': True
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            title = info.get('title', None)
            total_seconds = info.get('duration', 0)
            duration_string = str(datetime.timedelta(seconds=total_seconds))

            return {
                "title": title,
                "duration_seconds": total_seconds,
                "duration_string": duration_string
            }