from core.domain.models import User as DomainUser, Video as DomainVideo, Transcription as DomainTranscription
from infrastructure.models import User as DjangoUser, Video as DjangoVideo, Transcription as DjangoTranscription

def to_domain_user(django_user: DjangoUser) -> DomainUser:
    """Mapea un modelo User de Django a una entidad de dominio User."""
    return DomainUser(
        id=django_user.id,
        username=django_user.username,
        email=django_user.email,
        rol=django_user.rol
    )

def to_domain_video(django_video: DjangoVideo) -> DomainVideo:
    """Mapea un modelo Video de Django a una entidad de dominio Video."""
    return DomainVideo(
        id=django_video.id,
        title=django_video.title,
        video_path=str(django_video.video_path) if django_video.video_path else None,
        user_id=django_video.user_id
    )

def to_domain_transcription(django_transcription: DjangoTranscription) -> DomainTranscription:
    """Mapea un modelo Transcription de Django a una entidad de dominio Transcription."""
    return DomainTranscription(
        id=django_transcription.id,
        text=django_transcription.text,
        video_id=django_transcription.video_id
    )
