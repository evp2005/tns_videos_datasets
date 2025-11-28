from dataclasses import dataclass
from typing import Optional

@dataclass(frozen=True)
class User:
    """
    Entidad de dominio que representa a un Usuario.
    """
    id: int
    username: str
    email: str
    rol: str

@dataclass(frozen=True)
class Video:
    """
    Entidad de dominio que representa un Video.
    """
    id: int
    title: str
    video_path: Optional[str] 
    user_id: int

@dataclass(frozen=True)
class Transcription:
    """
    Entidad de dominio que representa una Transcripción.
    """
    id: int
    text: str
    video_id: int


# DOBLAJE J SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS
from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional
from enum import Enum

class DubbingStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

@dataclass
class AudioSegment:
    start_time: float
    end_time: float
    original_text: str
    translated_text: str
    audio_path: str
    confidence: float

@dataclass
class DubbingProject:
    id: str
    video_path: str
    original_language: str
    target_language: str
    status: DubbingStatus
    segments: List[AudioSegment]
    created_at: datetime
    completed_at: Optional[datetime]
    use_premium_voice: bool
    
    def add_segment(self, segment: AudioSegment):
        self.segments.append(segment)