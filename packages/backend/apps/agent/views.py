import os
import shutil
import subprocess
import tempfile
import zipfile
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from apps.api.serializers import EscuelaITURLSerializer, YTSerializer
from .serializers import VideoSegmentationSerializer
from core import services
from core.services import VideoProcessingError, get_m3u8_url_from_page
from infrastructure.scraping.selenium_video_scraper import SeleniumVideoScraper
from infrastructure.web.youtube import YouTubeTranscriptService
from .agent import AgenteP
from infrastructure.web.http_client import HTTPContentFetcher
from infrastructure.web.youtube import YouTubeTranscriptService
from utils.text_utils import get_youtube_video_id
from dotenv import load_dotenv

load_dotenv()

@csrf_exempt
@api_view(['POST'])
def process_vtt_to_markdown_escuelait(request):
    """
    Endpoint para procesar una URL de EscuelaIT, extraer su VTT y devolver un resumen en Markdown.
    """
    serializer = EscuelaITURLSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    escuela_it_url = serializer.validated_data['url']

    scraper = SeleniumVideoScraper()
    try:
        try:
            fetcher = HTTPContentFetcher()
            vtt_url = services.get_texttrack_url_from_page(escuela_it_url, scraper)

            vtt_content = services.get_raw_content_from_url(vtt_url, fetcher)
            if not vtt_content or "Error 410 Gone" in vtt_content:
                raise VideoProcessingError("La URL del VTT ha expirado o no es válida (Error 410 Gone).")

            # 4. Inicializar y ejecutar el agente con el contenido
            agent = AgenteP()
            agent.set_up()
            markdown_output = agent.query(vtt_content)

            return Response({"status": "success", "result": markdown_output})

        except VideoProcessingError as e:
            return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    finally:
        if scraper and scraper.driver:
            scraper.driver.quit()

@csrf_exempt
@api_view(['POST'])
def process_vtt_to_markdown_youtube(request):
    """
    Endpoint para procesar una URL de Youtube, extraer su VTT y devolver un resumen en Markdown.
    """
    # 1. Validar que la URL sea de Youtube
    serializer = YTSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    youtube_url = serializer.validated_data['url']

    try:
        video_id = get_youtube_video_id(youtube_url)
        if not video_id:
            raise VideoProcessingError("No se pudo extraer el ID del video de la URL proporcionada.")

        youtube_service = YouTubeTranscriptService()
        vtt_content = services.get_youtube_transcript(video_id, 'vtt', youtube_service)

        if "Error 410 Gone" in vtt_content:
            raise VideoProcessingError("La URL del VTT ha expirado o no es válida (Error 410 Gone).")
        
        agent = AgenteP()
        agent.set_up()
        markdown_output = agent.query(vtt_content)

        return Response({"status": "success", "result": markdown_output})

    except VideoProcessingError as e:
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
@api_view(['POST'])
def generate_clips_endpoint(request):
    """
    Endpoint para generar clips de video basados en segmentos de tiempo.
    """
    from apps.agent.serializers import GenerateClipsSerializer
    from .segmen import Segmentacion

    serializer = GenerateClipsSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    minutes_json = serializer.validated_data['minutes_json']
    video_path = serializer.validated_data['video_path']
    output_name = serializer.validated_data['output_name']

    try:
        segmentador = Segmentacion()
        # generate_clips imprime a consola, pero no retorna nada específico.
        # Asumimos éxito si no lanza excepción.
        segmentador.generate_clips(minutes_json, video_path, output_name)
        
        return Response({"status": "success", "message": "Clips generados exitosamente."}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
@api_view(['POST'])
def segment_video_escuelait(request):

    """
    Endpoint para segmentar un video de EscuelaIT basado en una lista de tiempos.
    Descarga el video completo, lo corta en segmentos y devuelve un archivo ZIP.
    """
    serializer = VideoSegmentationSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    video_url = data['url']  # CORRECCIÓN: Usar 'url' para ser consistente con el endpoint de YouTube.
    video_title = data['video_title']
    segments = data['segments']
    scraper = SeleniumVideoScraper()

    temp_dir = tempfile.mkdtemp()

    try:
        # --- CAMBIO: Usamos get_m3u8_info para obtener URL y User-Agent real ---
        # Si usas el código anterior, asegúrate de haber actualizado selenium_video_scraper.py
        video_info = scraper.get_m3u8_url(video_url)
        
        if not video_info or not video_info.get('url'):
            raise VideoProcessingError("No se pudo obtener la URL M3U8 del video. El scraper no la encontró.")

        m3u8_url = video_info['url']
        real_user_agent = video_info.get('user_agent')
        
        # Fallback de seguridad por si el scraper no devolvió el UA
        if not real_user_agent:
            print("WARNING: User-Agent no detectado, usando default.")
            real_user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

        full_video_path = os.path.join(temp_dir, 'full_video.mp4')
        print(f"Descargando video desde {m3u8_url} a {full_video_path}")
        print(f"Usando User-Agent: {real_user_agent}")
        
        # Usamos el User-Agent dinámico que coincide con el scraper
        headers = (
            f"Referer: {video_url}\r\n"
            f"User-Agent: {real_user_agent}\r\n"
        )

        subprocess.run(
            ['ffmpeg', '-protocol_whitelist', 'file,http,https,tcp,tls,crypto', 
             '-user_agent', real_user_agent, # Flag nativo de FFmpeg
             '-headers', headers,            # Headers HTTP
             '-i', m3u8_url, 
             '-c', 'copy', full_video_path],
            check=True, capture_output=True, text=True
        )

        # --- PASO 3: Cortar el video en segmentos ---
        clip_paths = []
        for i, segment in enumerate(segments):
            start_time = segment['start']
            end_time = segment['end']
            # Limpiamos el título del capítulo para usarlo como nombre de archivo
            safe_title = "".join([c for c in segment['title'] if c.isalpha() or c.isdigit() or c==' ']).rstrip()
            output_filename = f"{i+1:02d} - {safe_title}.mp4"
            output_path = os.path.join(temp_dir, output_filename)

            print(f"Cortando segmento: {start_time} -> {end_time} en {output_path}")
            
            # Usamos -c copy para un corte casi instantáneo
            subprocess.run(
                ['ffmpeg', '-i', full_video_path, '-ss', start_time, '-to', end_time, '-c', 'copy', output_path],
                check=True, capture_output=True, text=True
            )
            clip_paths.append(output_path)

        # --- PASO 4: Crear el archivo ZIP ---
        # Limpiamos el título del video para el nombre del ZIP
        safe_video_title = "".join([c for c in video_title if c.isalpha() or c.isdigit() or c==' ']).rstrip()
        zip_filename = f"{safe_video_title}.zip"
        zip_path = os.path.join(temp_dir, zip_filename)
        
        print(f"Creando archivo ZIP en {zip_path}")
        with zipfile.ZipFile(zip_path, 'w') as zipf:
            for clip_path in clip_paths:
                zipf.write(clip_path, os.path.basename(clip_path))

        # --- PASO 5: Enviar el ZIP como respuesta ---
        if os.path.exists(zip_path):
            with open(zip_path, 'rb') as f:
                response = HttpResponse(f.read(), content_type='application/zip')
                response['Content-Disposition'] = f'attachment; filename="{zip_filename}"'
                return response
        else:
            raise VideoProcessingError("No se pudo crear el archivo ZIP.")

    except subprocess.CalledProcessError as e:
        # Capturamos errores de FFmpeg para dar un mensaje más claro
        error_message = f"Error durante el procesamiento con FFmpeg: {e.stderr}"
        print(error_message)
        return Response({"status": "error", "message": error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    except VideoProcessingError as e:
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    except Exception as e:
        # Captura cualquier otra excepción
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    finally:
        # --- PASO 6: Limpieza ---
        # Nos aseguramos de borrar el directorio temporal y todo su contenido
        if os.path.exists(temp_dir):
            print(f"Limpiando directorio temporal: {temp_dir}")
            shutil.rmtree(temp_dir)


@csrf_exempt
@api_view(['POST'])
def segment_video_youtube(request):
    """
    Endpoint para segmentar un video de YouTube basado en una lista de tiempos.
    Descarga el video completo, lo corta en segmentos y devuelve un archivo ZIP.
    """
    serializer = VideoSegmentationSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    url = data['url']
    video_title = data['video_title']
    segments = data['segments']

    temp_dir = tempfile.mkdtemp()

    try:
        # --- PASO 1: Obtener la URL de descarga usando Pytube ---
        youtube_service = YouTubeTranscriptService()
        download_url = youtube_service.get_download_url(url)

        if not download_url:
            raise VideoProcessingError("No se pudo obtener una URL de descarga para el video de YouTube.")

        # --- PASO 2: Descargar el video completo usando FFmpeg ---
        full_video_path = os.path.join(temp_dir, 'full_video.mp4')
        print(f"Descargando video de YouTube desde {download_url} a {full_video_path}")

        # Para YouTube, generalmente no se necesitan cabeceras complejas,
        # pero añadir un User-Agent es una buena práctica.
        subprocess.run(
            ['ffmpeg',
             '-user_agent', "Mozilla/5.0", # User-Agent genérico
             '-i', download_url,
             '-c', 'copy', full_video_path],
            check=True, capture_output=True, text=True
        )

        # --- PASO 3: Cortar el video en segmentos (LÓGICA IDÉNTICA) ---
        clip_paths = []
        for i, segment in enumerate(segments):
            start_time = segment['start']
            end_time = segment['end']
            safe_title = "".join([c for c in segment['title'] if c.isalpha() or c.isdigit() or c==' ']).rstrip()
            output_filename = f"{i+1:02d} - {safe_title}.mp4"
            output_path = os.path.join(temp_dir, output_filename)

            print(f"Cortando segmento: {start_time} -> {end_time} en {output_path}")

            subprocess.run(
                ['ffmpeg', '-i', full_video_path, '-ss', start_time, '-to', end_time, '-c', 'copy', output_path],
                check=True, capture_output=True, text=True
            )
            clip_paths.append(output_path)

        # --- PASO 4: Crear el archivo ZIP (LÓGICA IDÉNTICA) ---
        safe_video_title = "".join([c for c in video_title if c.isalpha() or c.isdigit() or c==' ']).rstrip()
        zip_filename = f"{safe_video_title}.zip"
        zip_path = os.path.join(temp_dir, zip_filename)
        
        print(f"Creando archivo ZIP en {zip_path}")
        with zipfile.ZipFile(zip_path, 'w') as zipf:
            for clip_path in clip_paths:
                zipf.write(clip_path, os.path.basename(clip_path))

        # --- PASO 5: Enviar el ZIP como respuesta (LÓGICA IDÉNTICA) ---
        if os.path.exists(zip_path):
            with open(zip_path, 'rb') as f:
                response = HttpResponse(f.read(), content_type='application/zip')
                response['Content-Disposition'] = f'attachment; filename="{zip_filename}"'
                return response
        else:
            raise VideoProcessingError("No se pudo crear el archivo ZIP.")

    except subprocess.CalledProcessError as e:
        error_message = f"Error durante el procesamiento con FFmpeg: {e.stderr}"
        print(error_message)
        return Response({"status": "error", "message": error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except VideoProcessingError as e:
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    finally:
        # --- PASO 6: Limpieza (LÓGICA IDÉNTICA) ---
        if os.path.exists(temp_dir):
            print(f"Limpiando directorio temporal: {temp_dir}")
            shutil.rmtree(temp_dir)