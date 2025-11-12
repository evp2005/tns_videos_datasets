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
from .serializers import EscuelaITURLSerializer, AudioSaveSerializer, VimeoTextTrackSerializer, VTTContentSerializer

# Endpoint para obtener todos los usuarios
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