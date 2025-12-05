from django.urls import path
from django.http import JsonResponse
#from .views import dub_video, health_check, download_file
import logging

from . import views

def debug_test(request):
    print(" DEBUG TEST: ¡Endpoint funcionando!")
    return JsonResponse({"status": "debug_working"})

logger = logging.getLogger(__name__)
logger.info("URLs de dubbing cargadas correctamente")

urlpatterns = [
    path('dub/', views.dub_video, name='dub_video'),
    path('health/', views.health_check, name='dubbing_health'),
    path('download/<str:filename>/', views.download_file, name='download_dubbed'),
    path('debug-test/', debug_test, name='debug_test'),
path('dub-from-url/', views.dub_video_from_url, name='dub_video_from_url'),

]