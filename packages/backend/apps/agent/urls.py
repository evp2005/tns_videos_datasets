from django.urls import path
from .views import process_vtt_to_markdown_escuelait, process_vtt_to_markdown_youtube, generate_clips_endpoint, segment_video_youtube, segment_video_escuelait

urlpatterns = [
    path('process-vtt-escuelait', process_vtt_to_markdown_escuelait, name='process_vtt_to_markdown_escuelait'),
    path('process-vtt-youtube', process_vtt_to_markdown_youtube, name='process_vtt_to_markdown_youtube'),
    path('generate-clips', generate_clips_endpoint, name='generate_clips'),
    path('segment-video-escuelait', segment_video_escuelait, name='segment_video_escuelait'),
    path('segment-video-youtube', segment_video_youtube, name='segment_video_youtube'),
]