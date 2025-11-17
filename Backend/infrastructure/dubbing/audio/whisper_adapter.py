import os
import subprocess
from typing import List, Dict, Any

class WhisperAudioAdapter:
    def __init__(self):
        self.whisper_model = None
        self._load_whisper()
    
    def _load_whisper(self):
        """Cargar modelo Whisper"""
        try:
            import whisper
            print("🔄 Cargando modelo Whisper para transcripción precisa...")
            self.whisper_model = whisper.load_model("base")
            print("✅ Modelo Whisper cargado")
        except ImportError as e:
            print(f"❌ Whisper no disponible: {e}")
            self.whisper_model = None
        except Exception as e:
            print(f"❌ Error cargando Whisper: {e}")
            self.whisper_model = None
    
    def is_available(self) -> bool:
        return self.whisper_model is not None
    
    def is_whisper_loaded(self) -> bool:
        return self.whisper_model is not None
    
    def extract_audio(self, video_path: str, output_audio_path: str) -> bool:
        """Extraer audio usando FFmpeg"""
        try:
            cmd = [
                'ffmpeg', '-i', video_path,
                '-q:a', '0', '-map', 'a',
                '-y', output_audio_path
            ]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
            return result.returncode == 0
        except Exception as e:
            print(f"❌ Error extrayendo audio con FFmpeg: {e}")
            return False
    
    def transcribe_audio(self, audio_path: str, language: str = "auto") -> List[Dict[str, Any]]:
        """Transcripción con Whisper"""
        try:
            if self.whisper_model is None:
                return []
            
            lang = None if language == 'auto' else language
            
            result = self.whisper_model.transcribe(
                audio_path,
                language=lang,
                task="transcribe",
                verbose=False,
                word_timestamps=False
            )
            
            return result.get('segments', [])
            
        except Exception as e:
            print(f"❌ Error en transcripción Whisper: {e}")
            return []
    
    def mix_audio_tracks(self, original_video_path: str, dubbed_audio_path: str, output_path: str) -> bool:
        """Mezclar pistas de audio"""
        try:
            cmd = [
                'ffmpeg', '-i', original_video_path, '-i', dubbed_audio_path,
                '-c:v', 'copy', '-map', '0:v:0', '-map', '1:a:0',
                '-shortest', '-y', output_path
            ]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
            return result.returncode == 0
        except Exception as e:
            print(f"❌ Error mezclando audio: {e}")
            return False