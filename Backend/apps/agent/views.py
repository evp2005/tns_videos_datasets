import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from apps.api.serializers import EscuelaITURLSerializer, YTSerializer
from core import services
from core.services import VideoProcessingError
from infrastructure.scraping.selenium_video_scraper import SeleniumVideoScraper
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

            print("Markdown Output:", markdown_output) 
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

        print("Markdown Output:", markdown_output)  
        return Response({"status": "success", "result": markdown_output})

    except VideoProcessingError as e:
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
