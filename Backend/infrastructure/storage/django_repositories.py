from typing import Optional
from django.contrib.auth.hashers import make_password, check_password
from core.ports.repositories import UserRepository, VideoRepository, TranscriptionRepository
from ..models import User, Video, Transcription

class DjangoUserRepository(UserRepository):
    def create(self, username: str, email: str, password_plaintext: str) -> User:
        password_hash = make_password(password_plaintext)
        return User.objects.create(
            username=username,
            email=email,
            password=password_hash  # El hash ya viene del core
        )

    def get_by_email(self, email: str) -> Optional[User]:
        try:
            return User.objects.get(email=email)
        except User.DoesNotExist:
            return None

    def get_by_id(self, user_id: int) -> Optional[User]:
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None

    def get_all(self) -> list[User]:
        return list(User.objects.all()) # Devolvemos objetos User, la vista los serializará

    def check_password(self, user: User, password_plaintext: str) -> bool:
        return check_password(password_plaintext, user.password)

class DjangoVideoRepository(VideoRepository):
    def get_by_id(self, video_id: int) -> Optional[Video]:
        try:
            return Video.objects.get(pk=video_id)
        except Video.DoesNotExist:
            return None

    def create(self, title: str, origin_video: str, duration: str, language: str, url_video: str, user: User) -> Video:
        return Video.objects.create(
            title=title,
            origin_video=origin_video,
            duration=duration,
            language=language,
            url_video=url_video,
            user=user
        )

class DjangoTranscriptionRepository(TranscriptionRepository):
    def update_or_create(self, video: Video, text: str) -> Transcription:
        transcription, _ = Transcription.objects.update_or_create(
            video=video,
            defaults={'text': text}
        )
        return transcription
