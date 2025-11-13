from typing import Optional
from django.contrib.auth.hashers import make_password, check_password
from core.ports.repositories import UserRepository, VideoRepository, TranscriptionRepository
from core.domain.models import User as DomainUser, Video as DomainVideo, Transcription as DomainTranscription
from ..models import User as DjangoUser, Video as DjangoVideo, Transcription as DjangoTranscription
from .mappers import to_domain_user, to_domain_video, to_domain_transcription

class DjangoUserRepository(UserRepository):
    def create(self, username: str, email: str, password_plaintext: str) -> DomainUser:
        password_hash = make_password(password_plaintext)
        django_user = DjangoUser.objects.create(
            username=username,
            email=email,
            password=password_hash  # El hash ya viene del core
        )
        return to_domain_user(django_user)

    def get_by_email(self, email: str) -> Optional[DomainUser]:
        try:
            django_user = DjangoUser.objects.get(email=email)
            return to_domain_user(django_user)
        except DjangoUser.DoesNotExist:
            return None

    def get_by_id(self, user_id: int) -> Optional[DomainUser]:
        try:
            django_user = DjangoUser.objects.get(pk=user_id)
            return to_domain_user(django_user)
        except DjangoUser.DoesNotExist:
            return None

    def get_all(self) -> list[DomainUser]:
        django_users = DjangoUser.objects.all()
        return [to_domain_user(user) for user in django_users]

    def check_password(self, user_id: int, password_plaintext: str) -> bool:
        try:
            django_user = DjangoUser.objects.get(pk=user_id)
            return check_password(password_plaintext, django_user.password)
        except DjangoUser.DoesNotExist:
            return False

class DjangoVideoRepository(VideoRepository):
    def get_by_id(self, video_id: int) -> Optional[DomainVideo]:
        try:
            django_video = DjangoVideo.objects.get(pk=video_id)
            return to_domain_video(django_video)
        except DjangoVideo.DoesNotExist:
            return None

    def create(self, title: str, origin_video: str, duration: str, language: str, url_video: str, user: DomainUser) -> DomainVideo:
        django_video = DjangoVideo.objects.create(
            title=title,
            origin_video=origin_video,
            duration=duration,
            language=language,
            url_video=url_video,
            user_id=user.id
        )
        return to_domain_video(django_video)

class DjangoTranscriptionRepository(TranscriptionRepository):
    def update_or_create(self, video: DomainVideo, text: str) -> DomainTranscription:
        django_transcription, _ = DjangoTranscription.objects.update_or_create(
            video_id=video.id,
            defaults={'text': text}
        )
        return to_domain_transcription(django_transcription)
