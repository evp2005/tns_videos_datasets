from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

urlpatterns = [
    path('users/get_users', views.get_users),
    path('users/create_user', views.create_user),
    path('users/login_user', views.login_user),
    path('users/upload_video', views.upload_video),
    path('save/', include(router.urls)),

    path('is-valid-escuelait-url', views.is_valid_escuelait_url, name='is_valid_escuelait_url'),
    path('get-texttrack-url', views.get_texttrack_url, name='get_texttrack_url'),
    path('get-m3u8-url', views.get_m3u8_url, name='get_m3u8_url'),
    path('save-audio-using-m3u8-url', views.save_audio_using_m3u8_url, name='save_audio_using_m3u8_url'),
    path('get-vtt-content', views.get_vtt_content, name='get_vtt_content'),
    path('vtt-to-plain-text', views.vtt_to_plain_text, name='vtt_to_plain_text'),

    path('is-valid-youtube-url', views.is_valid_youtube_url, name='is_valid_youtube_url'),
    path('get-youtube-transcript-json', views.get_youtube_transcript_json, name='get_youtube_transcript_json'),
    path('get-youtube-transcript-vtt', views.get_youtube_transcript_vtt, name='get_youtube_transcript_vtt'),
    path('get-youtube-transcript-plain-text', views. get_youtube_transcript_plain_text, name='get_youtube_transcript-plain_text'),
    path('get-youtube-transcript-srt', views. get_youtube_transcript_srt, name='get_youtube_transcript_srt'),
    path('get-youtube-video-details', views. get_youtube_video_details, name='get_youtube_video_details'),
    path('get-youtube-thumbnail', views.get_youtube_thumbnail, name='get_youtube_thumbnail'),
    
    path('transcribe-video-file/<int:video_id>/', views.transcribe_video_file, name='transcribe_video_file'),
]