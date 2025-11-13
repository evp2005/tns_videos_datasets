from abc import ABC, abstractmethod
from typing import Any, Optional

class UserRepository(ABC):
    @abstractmethod
    def create(self, username: str, email: str, password_plaintext: str) -> Any:
        pass

    @abstractmethod
    def get_by_email(self, email: str) -> Optional[Any]:
        pass

    @abstractmethod
    def get_by_id(self, user_id: int) -> Optional[Any]:
        pass

    @abstractmethod
    def get_all(self) -> list[Any]:
        pass

    @abstractmethod
    def check_password(self, user: Any, password_plaintext: str) -> bool:
        pass

class VideoRepository(ABC):
    @abstractmethod
    def get_by_id(self, video_id: int) -> Optional[Any]:
        pass
    
    @abstractmethod
    def create(self, title: str, origin_video: str, duration: str, language: str, url_video: str, user: Any) -> Any:
        pass

class TranscriptionRepository(ABC):
    @abstractmethod
    def update_or_create(self, video: Any, text: str) -> Any:
        pass

    @abstractmethod
    def get_by_video_id(self, video_id: int) -> Optional[Any]:
        pass
