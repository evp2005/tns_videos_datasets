import os
import json
import tempfile
import subprocess
import shutil
from django.http import JsonResponse, FileResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from core.services import DubbingService, VideoProcessingError
from infrastructure.scraping.selenium_video_scraper import SeleniumVideoScraper
from infrastructure.web.youtube import YouTubeTranscriptService


@csrf_exempt
@require_http_methods(["POST"])
def dub_video(request):
    print(" === DOBLAJE POST RECIBIDO ===")
    try:
        print("🔍 DEBUG: Iniciando DOBLAJE...")
        print(f" DEBUG: Método: {request.method}")
        print(f" FILES recibidos: {list(request.FILES.keys())}")
        print(f" POST recibidos: {list(request.POST.keys())}")
        
        # Verificar que el archivo esté presente (usando request.FILES de Django)
        if 'file' not in request.FILES:
            print(" DEBUG: No hay archivo en request.FILES")
            return JsonResponse({
                "success": False,
                "message": "No se seleccionó archivo"
            }, status=400)
        
        # Obtener datos directamente de request.FILES y request.POST
        file_obj = request.FILES['file']
        source_lang = request.POST.get('source_lang', 'auto')
        target_lang = request.POST.get('target_lang', 'es')
        use_edge_tts = request.POST.get('use_edge_tts', 'false').lower() == 'true'
        
        filename = file_obj.name
        file_data = file_obj.read()  # Leer los bytes del archivo
        
        print(f" Procesando: {filename} -> {target_lang}")
        print(f" Idioma origen: {source_lang} | TTS: {'Edge' if use_edge_tts else 'gTTS'}")
        print(f" Tamaño del archivo: {len(file_data)} bytes")
        
        # Validar que el archivo no esté vacío
        if not filename or len(file_data) == 0:
            return JsonResponse({
                "success": False,
                "message": "Archivo vacío o inválido"
            }, status=400)
        
        print(" Iniciando DubbingService...")
        dubbing_service = DubbingService()
        
        # Procesar doblaje
        print(" Llamando a process_dubbing...")
        success, result_info = dubbing_service.process_dubbing(
            file_data, filename, source_lang, target_lang, use_edge_tts
        )

        print(f" Resultado del doblaje: {success}")
        print(f" Info: {result_info}")
        
        if success:
            return JsonResponse({
                "success": True,
                "message": "🎉 Video doblado exitosamente!",
                "download_url": f"/api/dubbing/download/{result_info['output_filename']}",
                "dubbing_type": "preciso",
                "transcribed_segments": result_info.get("transcribed_segments", 0),
                "translated_segments": result_info.get("translated_segments", 0),
                "total_duration": result_info.get("total_duration", 0)
            })
        else:
            return JsonResponse({
                "success": False,
                "message": f" Error en doblaje: {result_info.get('error', 'Error desconocido')}"
            }, status=500)
            
    except Exception as e:
        print(f" Error en dub_video: {str(e)}")
        import traceback
        traceback.print_exc()
        return JsonResponse({
            "success": False,
            "message": f"Error interno: {str(e)}"
        }, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def dub_video_from_url(request):
    """
    Endpoint para doblar un video desde una URL (YouTube o EscuelaIT).
    Descarga el video, lo procesa y devuelve el resultado doblado.
    """
    
    scraper = None
    temp_dir = tempfile.mkdtemp()
    
    try:
        # Parsear el body JSON
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({
                "success": False,
                "message": "Cuerpo de la petición inválido (JSON mal formado)"
            }, status=400)
        
        # Validar campos requeridos
        video_url = data.get('url')
        target_lang = data.get('target_lang', 'es')
        origin_video = data.get('origin_video', 'youtube')
        video_title = data.get('video_title', 'video')
        source_lang = data.get('source_lang', 'auto')
        use_edge_tts = data.get('use_edge_tts', False)
        
        if not video_url:
            return JsonResponse({
                "success": False,
                "message": "Se requiere la URL del video"
            }, status=400)
        
        print(f" URL recibida: {video_url}")
        print(f" Origen: {origin_video} | Idioma destino: {target_lang}")
        print(f" Título: {video_title}")
        
        # --- PASO 1: Descargar el video según su origen ---
        temp_video_path = os.path.join(temp_dir, 'input_video.mp4')
        
        if origin_video == 'youtube':
            print(" Descargando video de YouTube...")
            youtube_service = YouTubeTranscriptService()
            download_url = youtube_service.get_download_url(video_url)
            
            if not download_url:
                raise VideoProcessingError("No se pudo obtener una URL de descarga para el video de YouTube.")

            subprocess.run(
                ['ffmpeg',
                 '-user_agent', "Mozilla/5.0",
                 '-i', download_url,
                 '-c', 'copy', temp_video_path],
                check=True, capture_output=True, text=True
            )
            print(f" Video de YouTube descargado: {temp_video_path}")
        
        elif origin_video == 'escuelait':
            print(" Descargando video de EscuelaIT...")
            scraper = SeleniumVideoScraper()
            
            video_info = scraper.get_m3u8_url(video_url)
            
            if not video_info or not video_info.get('url'):
                raise VideoProcessingError("No se pudo obtener la URL M3U8 del video.")

            m3u8_url = video_info['url']
            real_user_agent = video_info.get('user_agent', 'Mozilla/5.0')
            
            headers = (
                f"Referer: {video_url}\r\n"
                f"User-Agent: {real_user_agent}\r\n"
            )

            subprocess.run(
                ['ffmpeg', '-protocol_whitelist', 'file,http,https,tcp,tls,crypto',
                 '-user_agent', real_user_agent,
                 '-headers', headers,
                 '-i', m3u8_url,
                 '-c', 'copy', temp_video_path],
                check=True, capture_output=True, text=True
            )
            print(f" Video de EscuelaIT descargado: {temp_video_path}")
        
        else:
            raise VideoProcessingError(f"Origen de video no soportado: {origin_video}")

        # --- PASO 2: Leer el video descargado como bytes ---
        with open(temp_video_path, 'rb') as f:
            file_data = f.read()
        
        filename = f"{video_title}.mp4"
        
        print(f" Video descargado: {len(file_data)} bytes")
        
        # --- PASO 3: Procesar el doblaje usando DubbingService ---
        print(" Iniciando DubbingService...")
        dubbing_service = DubbingService()
        
        print(" Llamando a process_dubbing...")
        success, result_info = dubbing_service.process_dubbing(
            file_data, filename, source_lang, target_lang, use_edge_tts
        )

        print(f" Resultado del doblaje: {success}")
        print(f" Info: {result_info}")
        
        if success:
            # --- PASO 4: Devolver el archivo doblado ---
            output_filename = result_info['output_filename']
            output_path = dubbing_service.get_output_path(output_filename)
            
            if os.path.exists(output_path):
                with open(output_path, 'rb') as f:
                    from django.http import HttpResponse
                    response = HttpResponse(f.read(), content_type='video/mp4')
                    safe_title = "".join([c for c in video_title if c.isalpha() or c.isdigit() or c==' ']).rstrip()
                    response['Content-Disposition'] = f'attachment; filename="{safe_title}_doblado_{target_lang}.mp4"'
                    
                    print(f" Enviando video doblado: {safe_title}_doblado_{target_lang}.mp4")
                    return response
            else:
                raise VideoProcessingError("No se pudo encontrar el video doblado generado.")
        else:
            return JsonResponse({
                "success": False,
                "message": f" Error en doblaje: {result_info.get('error', 'Error desconocido')}"
            }, status=500)
    
    except subprocess.CalledProcessError as e:
        error_message = f"Error durante el procesamiento con FFmpeg: {e.stderr}"
        print(f" {error_message}")
        return JsonResponse({
            "success": False,
            "message": error_message
        }, status=500)
    
    except VideoProcessingError as e:
        print(f" VideoProcessingError: {str(e)}")
        return JsonResponse({
            "success": False,
            "message": str(e)
        }, status=500)
    
    except Exception as e:
        print(f" Error en dub_video_from_url: {str(e)}")
        import traceback
        traceback.print_exc()
        return JsonResponse({
            "success": False,
            "message": f"Error interno: {str(e)}"
        }, status=500)
    
    finally:
        # Limpiar recursos
        if scraper and hasattr(scraper, 'driver') and scraper.driver:
            try:
                scraper.driver.quit()
                print(" Selenium driver cerrado")
            except:
                pass
        
        if os.path.exists(temp_dir):
            try:
                shutil.rmtree(temp_dir)
                print(f" Directorio temporal limpiado: {temp_dir}")
            except:
                pass


@csrf_exempt
def health_check(request):
    dubbing_service = DubbingService()
    
    return JsonResponse({
        "status": "ok", 
        "message": "Servidor de doblaje funcionando",
        "dubbing_precise": dubbing_service.is_dubbing_available(),
        "whisper_loaded": dubbing_service.is_whisper_loaded()
    })


@csrf_exempt
def download_file(request, filename):
    dubbing_service = DubbingService()
    
    file_path = dubbing_service.get_output_path(filename)
    
    if os.path.exists(file_path):
        response = FileResponse(open(file_path, 'rb'))
        response['Content-Type'] = 'video/mp4'
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response
    else:
        return JsonResponse({
            "success": False,
            "message": "Archivo no encontrado"
        }, status=404)


# Funciones auxiliares para parsear multipart (de tu código original)
def _get_boundary(content_type):
    for part in content_type.split(';'):
        if 'boundary=' in part:
            return part.split('=')[1].strip()
    return None


def _parse_multipart_form_data(body, boundary):
    data = {}
    boundary_bytes = f"--{boundary}".encode()
    end_boundary_bytes = f"--{boundary}--".encode()
    
    parts = body.split(boundary_bytes)
    for part in parts[1:]:
        if part.strip() and not part.startswith(end_boundary_bytes):
            _parse_part(part, data)
            
    return data


def _parse_part(part, data):
    headers_end = part.find(b'\r\n\r\n')
    if headers_end == -1:
        return
        
    headers_part = part[:headers_end]
    body = part[headers_end + 4:]  # +4 para saltar \r\n\r\n
    
    headers = {}
    for line in headers_part.split(b'\r\n'):
        if b':' in line:
            key, value = line.split(b':', 1)
            headers[key.strip().decode()] = value.strip().decode()
    
    content_disposition = headers.get('Content-Disposition', '')
    if 'filename=' in content_disposition:
        # Es un archivo
        name_start = content_disposition.find('name="') + 6
        name_end = content_disposition.find('"', name_start)
        name = content_disposition[name_start:name_end]
        
        filename_start = content_disposition.find('filename="') + 10
        filename_end = content_disposition.find('"', filename_start)
        filename = content_disposition[filename_start:filename_end]
        
        data[name] = {
            'filename': filename,
            'data': body,
            'headers': headers
        }
    else:
        # Es un campo normal
        name_start = content_disposition.find('name="') + 6
        name_end = content_disposition.find('"', name_start)
        name = content_disposition[name_start:name_end]
        data[name] = body.decode().strip()