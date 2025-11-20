from abc import ABC, abstractmethod
from typing import Any, Optional
from ..domain.models import User, Video, Transcription

class UserRepository(ABC):
    @abstractmethod
    def create(self, username: str, email: str, password_plaintext: str) -> User:
        pass

    @abstractmethod
    def get_by_email(self, email: str) -> Optional[User]:
        pass

    @abstractmethod
    def get_by_id(self, user_id: int) -> Optional[User]:
        pass

    @abstractmethod
    def get_all(self) -> list[User]:
        pass
    
    @abstractmethod
    def check_password(self, user_id: int, password_plaintext: str) -> bool:
        pass

class VideoRepository(ABC):
    @abstractmethod
    def get_by_id(self, video_id: int) -> Optional[Video]:
        pass
    
    @abstractmethod
    def create(self, title: str, origin_video: str, duration: str, language: str, url_video: str, user: User) -> Video:
        pass
    
    @abstractmethod
    def get_all(self) -> list[Video]:
        pass

class TranscriptionRepository(ABC):
    @abstractmethod
    def update_or_create(self, video: Video, text: str) -> Transcription:
        pass

    @abstractmethod
    def get_by_video_id(self, video_id: int) -> Optional[Transcription]:
        pass
