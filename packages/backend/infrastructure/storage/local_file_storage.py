from core.ports.storage import AudioStorage
from utils import audio_utils

class LocalAudioStorage(AudioStorage):
    def save_audio_from_m3u8(self, m3u8_url: str, file_name: str) -> str:
        return audio_utils.save_audio_using_m3u8_url(m3u8_url, file_name)
