from django.urls import path
from .views import process_vtt_to_markdown_escuelait, process_vtt_to_markdown_youtube

urlpatterns = [
    path('process-vtt-escuelait', process_vtt_to_markdown_escuelait, name='process_vtt_to_markdown_escuelait'),
    path('process-vtt-youtube', process_vtt_to_markdown_youtube, name='process_vtt_to_markdown_youtube'),
]