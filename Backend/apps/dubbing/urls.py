from django.urls import path
from .views import dub_video, health_check, download_file

urlpatterns = [
    path('dub/', dub_video, name='dub_video'),
    path('health/', health_check, name='dubbing_health'),
    path('download/<str:filename>/', download_file, name='download_dubbed'),
]