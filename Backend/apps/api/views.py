import json
from core import services
from django.http import JsonResponse
from utils import http_utils, text_utils
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from extractor import YouTubeThumbnailExtractor
from moviepy import VideoFileClip
from core.services import VideoProcessingError, AuthenticationError, UserCreationError
from django.views.decorators.csrf import csrf_exempt
from infrastructure.storage.local_file_storage import LocalAudioStorage
from infrastructure.scraping.selenium_video_scraper import SeleniumVideoScraper
from infrastructure.web.http_client import HTTPContentFetcher
from infrastructure.web.youtube import YouTubeTranscriptService
from infrastructure.storage.django_repositories import DjangoUserRepository, DjangoVideoRepository, DjangoTranscriptionRepository
from .serializers import EscuelaITURLSerializer, AudioSaveSerializer, VimeoTextTrackSerializer, VTTContentSerializer, YTSerializer
from utils.text_utils import get_youtube_video_id
from django.conf import settings
import whisper
import os


# Endpoint para obtener todos los usuarios
def get_users(request):
    user_repo = DjangoUserRepository()
    users = services.get_all_users(user_repo)
    serialized_users = [{"id": user.id, "username": user.username, "email": user.email, "rol": user.rol} for user in users]
    return JsonResponse(serialized_users, safe=False)

# Endpoint para crear un nuevo usuario
@csrf_exempt
def create_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            # 1. Instanciar dependencias de infrastructure
            user_repo = DjangoUserRepository()
            # 2. Llamar al caso de uso del core
            user = services.register_user(data["username"], data["email"], data["password"], user_repo)
            return JsonResponse({"mensaje": "Usuario creado con exito", "id": user.id})
        except UserCreationError as e:
            return JsonResponse({"error": str(e)}, status=400)
        except Exception:
            return JsonResponse({"error": "Error interno del servidor"}, status=500)
    return JsonResponse({"error": "Método no permitido"}, status=405)

# Endpoint para login de usuario
@csrf_exempt
def login_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body) # Asegúrate de que 'data' esté definida antes de usarla
            user_repo = DjangoUserRepository() # Instanciar el repositorio
            user = services.authenticate_user(data["email"], data["password"], user_repo) # Llamar al caso de uso
            return JsonResponse({"mensaje": "Login correcto", "id": user.id}) # Devolver respuesta
        except AuthenticationError as e: # Capturar excepciones de autenticación
            return JsonResponse({"error": str(e)}, status=401) # Devolver error 401
    return JsonResponse({"error": "Método no permitido"}, status=405)

# Endpoint para subir un video
@csrf_exempt
def upload_video(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user_repo = DjangoUserRepository()
        video_repo = DjangoVideoRepository()
        try:
            vid = services.create_video(
                title=data["title"],
                origin_video=data["origin_video"],
                duration=data["duration"],
                language=data["language"],
                url_video=data["url_video"],
                user_id=data["user_id"],
                user_repo=user_repo,
                video_repo=video_repo
            )
            return JsonResponse({"mensaje": "Video subido con exito", "id": vid.id})
        except UserCreationError as e: # Si el usuario no existe
            return JsonResponse({"error": str(e)}, status=400)
        except Exception as e:
            return JsonResponse({"error": "Error al subir el video: " + str(e)}, status=500)
    return JsonResponse({"error": "Método no permitido"}, status=405)


# EscuelaIT
@api_view(['POST']) 
def is_valid_escuelait_url(request):
    """
    Endpoint para validar una URL de EscuelaIT.
    """
    serializer = EscuelaITURLSerializer(data=request.data)

    if serializer.is_valid():
        return Response({
            "status": "success",
            "result": True
        })
    else:
        return Response({
            "status": "error",
            "message": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def get_texttrack_url(request):
    """
    Endpoint para obtener la URL del texttrack (VTT) usando Selenium.
    """
    serializer = EscuelaITURLSerializer(data=request.data)

    if not serializer.is_valid():
        return Response({
            "status": "error",
            "message": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    url = serializer.validated_data['url']
    
    scraper = SeleniumVideoScraper()
    
    try:
        # 2. Llamar al caso de uso
        track_src = services.get_texttrack_url_from_page(url, scraper)
        return Response({
          "status": "success",
          "result": track_src
        })
    except VideoProcessingError as e:
        return Response({
          "status": "error",
          "message": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def get_m3u8_url(request):
    """
    Endpoint para obtener la URL del m3u8 (video) usando Selenium.
    """
    serializer = EscuelaITURLSerializer(data=request.data)

    if not serializer.is_valid():
        return Response({
            "status": "error",
            "message": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    url = serializer.validated_data['url']
    scraper = SeleniumVideoScraper()

    try:
        m3u8_url = services.get_m3u8_url_from_page(url, scraper)
        return Response({
            "status": "success",
            "result": m3u8_url
        })
    except (VideoProcessingError, Exception) as e:
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def save_audio_using_m3u8_url(request):
    """
    Endpoint para guardar un archivo de audio (.m4a) desde una URL m3u8.
    """
    serializer = AudioSaveSerializer(data=request.data)

    if not serializer.is_valid():
        return Response({
            "status": "error",
            "message": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    
    storage = LocalAudioStorage()

    try:
        saved_file = services.save_audio_from_url(data["url"], data["file_name"], storage)
        return Response({
            "status": "success",
            "result": saved_file
        })
    except Exception as e:
        return Response({
            "status": "error",
            "message": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
def get_vtt_content(request):
    """
    Endpoint para descargar el contenido raw de un archivo VTT.
    """
    serializer = VimeoTextTrackSerializer(data=request.data)

    if not serializer.is_valid():
        return Response({
            "status": "error",
            "message": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    url = serializer.validated_data['url']
    fetcher = HTTPContentFetcher()

    try:
        raw_content = services.get_raw_content_from_url(url, fetcher)
        return Response({
            "status": "success",
            "result": raw_content
        })
    except VideoProcessingError as e:
        return Response({"status": "error", "message": str(e)}, status=500)

@api_view(['POST'])
def vtt_to_plain_text(request):
    """
    Endpoint para convertir un VTT raw a texto plano (limpieza simple).
    """
    serializer = VTTContentSerializer(data=request.data)

    if not serializer.is_valid():
        return Response({
            "status": "error",
            "message": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    vtt_content = serializer.validated_data['value']
    # Esta lógica es tan simple que puede permanecer aquí o en un servicio simple.
    # Por consistencia, la movemos a un `util` del core si se reutiliza.
    plain_value = text_utils.flatten_text(vtt_content)

    return Response({
        "status": "success",
        "result": plain_value
    })


# Youtube
@api_view(['POST']) 
def is_valid_youtube_url(request):
    """
    Endpoint para validar una URL de Youtube.
    """
    serializer = YTSerializer(data=request.data)

    if serializer.is_valid():
        return Response({
            "status": "success",
            "result": True
        })
    else:
        return Response({
            "status": "error",
            "message": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def get_youtube_transcript_json(request):
    """
    Endpoint para obtener la transcripción de un video de YouTube.
    """
    serializer = YTSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            "status": "error",
            "message": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    url = serializer.validated_data['url']
    video_id = get_youtube_video_id(url)

    if not video_id:
        return Response({
            "status": "error",
            "message": "No se pudo extraer el ID del video de la URL."
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        youtube_service = YouTubeTranscriptService()
        transcript_json = services.get_youtube_transcript(video_id, 'json', youtube_service)
        return Response({
            "status": "success",
            "result": json.loads(transcript_json) # Convertir la cadena JSON a un objeto JSON
        })
    except Exception as e:
        return Response({
            "status": "error",
            "message": f"No se pudo obtener la transcripción en JSON: {str(e)}"
        }, status=status.HTTP_404_NOT_FOUND) # 404 es común si no hay subtítulos

@api_view(['POST'])
def get_youtube_transcript_vtt(request):
    """
    Endpoint para obtener la transcripción de un video de YouTube.
    """
    serializer = YTSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            "status": "error",
            "message": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    url = serializer.validated_data['url']
    video_id = get_youtube_video_id(url)

    if not video_id:
        return Response({
            "status": "error",
            "message": "No se pudo extraer el ID del video de la URL."
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        youtube_service = YouTubeTranscriptService()
        transcript_vtt = services.get_youtube_transcript(video_id, 'vtt', youtube_service)
        return Response({
            "status": "success",
            "result": transcript_vtt
        })
    except Exception as e:
        return Response({
            "status": "error",
            "message": f"No se pudo obtener la transcripción en VTT: {str(e)}"
        }, status=status.HTTP_404_NOT_FOUND) # 404 es común si no hay subtítulos

@api_view(['POST'])
def get_youtube_transcript_srt(request):
    """
    Endpoint para obtener la transcripción de un video de YouTube.
    """
    serializer = YTSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            "status": "error",
            "message": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    url = serializer.validated_data['url']
    video_id = get_youtube_video_id(url)

    if not video_id:
        return Response({
            "status": "error",
            "message": "No se pudo extraer el ID del video de la URL."
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        youtube_service = YouTubeTranscriptService()
        transcript_srt = services.get_youtube_transcript(video_id, 'srt', youtube_service)
        return Response({
            "status": "success",
            "result": transcript_srt
        })
    except Exception as e:
        return Response({
            "status": "error",
            "message": f"No se pudo obtener la transcripción en SRT: {str(e)}"
        }, status=status.HTTP_404_NOT_FOUND) 
    
@api_view(['POST'])
def get_youtube_transcript_plain_text(request):
    """
    Endpoint para obtener la transcripción de un video de YouTube.
    """
    serializer = YTSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            "status": "error",
            "message": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    url = serializer.validated_data['url']
    video_id = get_youtube_video_id(url)

    if not video_id:
        return Response({
            "status": "error",
            "message": "No se pudo extraer el ID del video de la URL."
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        youtube_service = YouTubeTranscriptService()
        transcript_text = services.get_youtube_transcript(video_id, 'text', youtube_service)
        return Response({
            "status": "success",
            "result": transcript_text
        })
    except Exception as e:
        return Response({
            "status": "error",
            "message": f"No se pudo obtener la transcripción en texto plano: {str(e)}"
        }, status=status.HTTP_404_NOT_FOUND) # 404 es común si no hay subtítulos
    
@csrf_exempt
@api_view(['POST'])
def get_youtube_thumbnail(request):
    """
    Obtiene la miniatura de un video de YouTube.
    """
    serializer = YTSerializer(data=request.data)

    if not serializer.is_valid():
        return Response({
            "status": "error",
            "message": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    url = serializer.validated_data['url']

    try:
        extractor = YouTubeThumbnailExtractor()
        thumbnail = extractor.extract_thumbnail(url)
        return Response({
            "status": "success",
            "result": {thumbnail.url}
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            "status": "error",
            "message": f"Ocurrió un error al extraer la miniatura: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@csrf_exempt
@api_view(['POST'])
def get_youtube_video_details(request):
    """
    Obtiene los metadatos de un video de YouTube, incluyendo la duración.
    (Versión robusta usando yt-dlp)
    """
    serializer = YTSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            "status": "error",
            "message": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    url = serializer.validated_data['url']

    try:
        youtube_service = YouTubeTranscriptService()
        details = services.get_youtube_details(url, youtube_service)
        return Response({
            "status": "success",
            "result": details
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            "status": "error",
            "message": f"Ocurrió un error al procesar la URL con yt-dlp: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

# Video o archivo local
def _extract_audio_from_video(video_path: str, audio_output_path: str):
    try:
        video_clip = VideoFileClip(video_path)
        audio_clip = video_clip.audio
        os.makedirs(os.path.dirname(audio_output_path), exist_ok=True)
        audio_clip.write_audiofile(audio_output_path)
        audio_clip.close()
        video_clip.close()
        return audio_output_path
    except Exception as e:
        print(f"Error al extraer el audio: {e}")
        return None

# Función auxiliar para transcribir (puedes ponerla en un archivo de services)
def _transcribe_audio_with_whisper(audio_path: str) -> str:
    model = whisper.load_model("base")
    result = model.transcribe(audio_path)
    return result["text"]

@api_view(['POST'])
def transcribe_video_file(request, video_id):
    """
    Endpoint para transcribir un archivo de video subido.
    Orquesta la llamada al caso de uso de transcripción.
    """
    # 1. Instanciar dependencias de infrastructure
    video_repo = DjangoVideoRepository()
    transcription_repo = DjangoTranscriptionRepository()

    try:
        # 2. Llamar al caso de uso del core, pasándole las dependencias
        transcription = services.transcribe_video(
            video_id=video_id,
            video_repo=video_repo,
            transcription_repo=transcription_repo,
            audio_extractor=_extract_audio_from_video, # Pasamos las funciones como dependencias
            transcriber=_transcribe_audio_with_whisper,
            media_root=settings.MEDIA_ROOT
        )
        return Response({
            "status": "success",
            "message": "Video transcrito y guardado correctamente.",
            "transcription_id": transcription.id,
            "result": transcription.text
        })
    except VideoProcessingError as e:
        return Response({"status": "error", "message": str(e)}, status=404)
    except Exception as e:
        return Response({
            "status": "error",
            "message": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)