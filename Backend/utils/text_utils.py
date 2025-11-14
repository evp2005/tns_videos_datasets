import re

def get_youtube_video_id(url: str) -> str | None:
    """
    Extrae el ID de un video de YouTube de varios formatos de URL.

    Soporta formatos como:
    - https://www.youtube.com/watch?v=VIDEO_ID
    - https://youtu.be/VIDEO_ID
    - https://www.youtube.com/embed/VIDEO_ID
    - https://www.youtube.com/shorts/VIDEO_ID
    - https://m.youtube.com/watch?v=VIDEO_ID
    """
    regex = re.compile(
        r'(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)'
        r'([a-zA-Z0-9_-]{11})'
    )
    
    match = regex.search(url)
    
    if match:
        return match.group(1)
        
    return None

def flatten_text_yt(input: str) -> str:
    return " ".join(input.split())

def flatten_text(vtt_content: str) -> str:
    """Limpia un contenido VTT, eliminando timestamps y metadatos."""
    # Elimina el encabezado WEBVTT
    content = re.sub(r'WEBVTT\s*', '', vtt_content)
    # Elimina las líneas de tiempo y los números de secuencia
    content = re.sub(r'\d+\n\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}.*\n', '', content)
    # Reemplaza múltiples saltos de línea con un solo espacio
    content = re.sub(r'\n+', ' ', content)
    return content.strip()
