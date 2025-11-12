import json
from ...core import services
from ...models import User, Video
from django.http import JsonResponse
from ...utils import http_utils, text_utils
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from ...core.services import VideoProcessingError
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
from ..storage.local_file_storage import LocalAudioStorage
from ..scraping.selenium_video_scrapper import SeleniumVideoScraper
from .serializers import EscuelaITURLSerializer, AudioSaveSerializer, VimeoTextTrackSerializer, VTTContentSerializer, YTSerializer
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import JSONFormatter, TextFormatter, WebVTTFormatter, SRTFormatter
from ...utils.text_utils import get_youtube_video_id, flatten_text_yt
import datetime
import yt_dlp 
from django.conf import settings
from moviepy import VideoFileClip
import whisper
import os
from ...models import Transcription


# Endpoint para obtener todos los usuarios
@csrf_exempt
def get_users(request):
    users = User.objects.all().values()
    return JsonResponse(list(users), safe=False)

# Endpoint para crear un nuevo usuario
@csrf_exempt
def create_user(request):
    if request.method == "POST":
        data = json.loads(request.body)
        usr = User.objects.create(
            username=data["username"],
            email=data["email"],
            password=make_password(data["password"]),
        )   
        return JsonResponse({"mensaje": "Usuario creado con exito", "id": usr.id})
    return JsonResponse({"error": "Método no permitido"}, status=405)

# Endpoint para login de usuario
@csrf_exempt
def login_user(request):
    if request.method == "POST":
        data = json.loads(request.body)
        
        try:
            usr = User.objects.get(email=data["email"])
        except User.DoesNotExist:
            return JsonResponse({"error": "Usuario no encontrado"}, status=404)
        
        if check_password(data["password"], usr.password):
            return JsonResponse({"mensaje": "Login correcto", "id": usr.id})
        else:
            return JsonResponse({"error": "Contraseña incorrecta"}, status=401)
    
    return JsonResponse({"error": "Método no permitido"}, status=405)

# Endpoint para obtener todos los videos
def get_users(request):
    users = User.objects.all().values()
    return JsonResponse(list(users), safe=False)

# Endpoint para subir un video
@csrf_exempt
def upload_video(request):
    if request.method == "POST":
        data = json.loads(request.body)
        vid = Video.objects.create(
            title= data["title"],
            origin_video=data["origin_video"],
            duration=data["duration"],
            language=data["language"],
            url_video=data["url_video"],
            user_id=data["user_id"],
        )   
        return JsonResponse({"mensaje": "Video subido con exito", "id": vid.id})
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
        # La lógica de scraping ahora está en el adaptador, que es llamado por el servicio.
        # Para simplificar, llamaremos directamente al método del adaptador aquí.
        # Idealmente, habría un servicio `get_m3u8_url_from_page`.
        m3u8_url = scraper.get_m3u8_url(url)
        if m3u8_url is None:
            raise VideoProcessingError("No se pudo extraer la URL m3u8 de la página")
        
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
    
    # Instanciamos los adaptadores necesarios
    storage = LocalAudioStorage()
    # Este caso de uso no necesita scraping, solo el almacenamiento

    try:
        # Llamamos directamente al método del adaptador (o a un servicio que lo use)
        file_name = storage.save_audio_from_m3u8(data["url"], data["file_name"])
        return Response({
            "status": "success",
            "result": file_name
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
    raw_content = http_utils.get_raw_content(url) 

    if raw_content is None:
        return Response({
          "status": "error",
          "message": "Ocurrió una excepción ambigua al manejar la solicitud"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({
        "status": "success",
        "result": raw_content
    })

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
        # Obtiene la transcripción. Puedes especificar idiomas, ej: ['es', 'en']
        transcript = YouTubeTranscriptApi().fetch(video_id, languages=['es', 'en'])
        transcript_for = JSONFormatter().format_transcript(transcript)
        
        return Response({
            "status": "success",
            "result": transcript_for
        })
    except Exception as e:
        return Response({
            "status": "error",
            "message": f"No se pudo obtener la transcripción: {str(e)}"
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
        # Obtiene la transcripción. Puedes especificar idiomas, ej: ['es', 'en']
        transcript = YouTubeTranscriptApi().fetch(video_id, languages=['es', 'en'])
        transcript_for = WebVTTFormatter().format_transcript(transcript)
        
        return Response({
            "status": "success",
            "result": transcript_for
        })
    except Exception as e:
        return Response({
            "status": "error",
            "message": f"No se pudo obtener la transcripción: {str(e)}"
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
        # Obtiene la transcripción. Puedes especificar idiomas, ej: ['es', 'en']
        transcript = YouTubeTranscriptApi().fetch(video_id, languages=['es', 'en'])
        transcript_for = SRTFormatter().format_transcript(transcript)
        
        return Response({
            "status": "success",
            "result": transcript_for
        })
    except Exception as e:
        return Response({
            "status": "error",
            "message": f"No se pudo obtener la transcripción: {str(e)}"
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
        # Obtiene la transcripción. Puedes especificar idiomas, ej: ['es', 'en']
        transcript = YouTubeTranscriptApi().fetch(video_id, languages=['es', 'en'])
        transcript_for = TextFormatter().format_transcript(transcript)
        transcript_to_plain_text = flatten_text_yt(transcript_for)
        
        return Response({
            "status": "success",
            "result": transcript_to_plain_text
        })
    except Exception as e:
        return Response({
            "status": "error",
            "message": f"No se pudo obtener la transcripción: {str(e)}"
        }, status=status.HTTP_404_NOT_FOUND) # 404 es común si no hay subtítulos
    
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
        # Opciones para yt-dlp: solo queremos la metadata, no descargar
        ydl_opts = {
            'quiet': True,
            'skip_download': True,
            'force_generic_extractor': True
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # Extraemos la información
            info = ydl.extract_info(url, download=False) 
            
            title = info.get('title', None)
            total_seconds = info.get('duration', 0)
            duration_string = str(datetime.timedelta(seconds=total_seconds))
        
        return Response({
            "status": "success",
            "result": {
                "title": title,
                "duration_seconds": total_seconds,
                "duration_string": duration_string
            }
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        # Si yt-dlp falla, también lo capturamos
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
    Extrae el audio y utiliza Whisper para la transcripción.
    """
    try:
        video = Video.objects.get(pk=video_id)
        if not video.video_path:
            return Response({
                "status": "error",
                "message": "El video no tiene un archivo asociado."
            }, status=status.HTTP_400_BAD_REQUEST)

        video_full_path = os.path.join(settings.MEDIA_ROOT, video.video_path.name)
        
        # Define la ruta para el archivo de audio temporal
        audio_filename = f"{os.path.splitext(os.path.basename(video.video_path.name))[0]}.mp3"
        audio_output_path = os.path.join(settings.MEDIA_ROOT, 'audio', audio_filename)

        # 1. Extraer el audio
        extracted_audio_path = _extract_audio_from_video(video_full_path, audio_output_path)
        if not extracted_audio_path:
            raise Exception("No se pudo extraer el audio del video.")

        # 2. Transcribir el audio
        transcript_text = _transcribe_audio_with_whisper(extracted_audio_path)

        # 3. Guardar la transcripción en la base de datos
        transcription, created = Transcription.objects.update_or_create(
            video=video,
            defaults={'text': transcript_text}
        )
        
        # Opcional: limpiar el archivo de audio temporal
        os.remove(extracted_audio_path)
        
        return Response({
            "status": "success",
            "message": "Video transcrito y guardado correctamente.",
            "transcription_id": transcription.id,
            "result": transcript_text
        })

    except Video.DoesNotExist:
        return Response({
            "status": "error",
            "message": "El video no fue encontrado."
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            "status": "error",
            "message": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)