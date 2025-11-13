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