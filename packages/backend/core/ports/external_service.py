# DOBLAJE JJJ AAAAAAAAAAAAAAAAAAJDKFJSDLFJSD

from abc import ABC, abstractmethod
from typing import List, Dict, Any

class AudioProcessorPort(ABC):
    @abstractmethod
    def extract_audio(self, video_path: str, output_audio_path: str) -> bool:
        pass
    
    @abstractmethod
    def transcribe_audio(self, audio_path: str, language: str = "auto") -> List[Dict[str, Any]]:
        pass
    
    @abstractmethod
    def mix_audio_tracks(self, original_video_path: str, dubbed_audio_path: str, output_path: str) -> bool:
        pass

class TextTranslatorPort(ABC):
    @abstractmethod
    def translate_text(self, text: str, source_lang: str, target_lang: str) -> str:
        pass
    
    @abstractmethod
    def detect_language(self, text: str) -> str:
        pass

class VoiceSynthesizerPort(ABC):
    @abstractmethod
    def synthesize_speech(self, text: str, language: str, output_path: str, use_premium: bool = False) -> bool:
        pass