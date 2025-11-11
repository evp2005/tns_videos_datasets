from rest_framework import serializers
import re
from ...models import Video

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = '__all__'

class EscuelaITURLSerializer(serializers.Serializer):
    """
    Valida que la URL enviada sea una URL de clase de EscuelaIT.
    """
    url = serializers.URLField()

    def validate_url(self, value):
        pattern = r"^https:\/\/escuela.it\/cursos\/(.+)\/clase\/(.+)$"
        if not re.fullmatch(pattern, value):
            raise serializers.ValidationError("La 'url' no es una URL de EscuelaIT válida.")
        
        return value

class YTSerializer(serializers.Serializer):
    """
    Valida que la URL enviada sea una URL de clase de YT.
    """
    url = serializers.URLField()

    def validate_url(self, value):
        pattern_long = r"^https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})(?:&.*)?$"
        pattern_short = r"^https:\/\/youtu\.be\/([a-zA-Z0-9_-]{11})(?:\?.*)?$"

        if re.fullmatch(pattern_long, value) or re.fullmatch(pattern_short, value):
            return value

        raise serializers.ValidationError("La 'url' no es una URL de Youtube válida.")
    
class AudioSaveSerializer(serializers.Serializer):
    """
    Valida los campos para guardar un audio desde una URL m3u8.
    Reemplaza a @require_values(fields=["url", "file_name"])

    """
    url = serializers.URLField()
    file_name = serializers.CharField(max_length=255) 

class FileNameSerializer(serializers.Serializer):
    """
    Valida un único campo 'file_name'.
    Reemplaza a @require_values(fields=["file_name"])

    """
    file_name = serializers.CharField(max_length=255)

class VimeoTextTrackSerializer(serializers.Serializer):
    """
    Valida que la URL sea una URL de texttrack de Vimeo.
    Reemplaza a @require_texttrack_url

    """
    url = serializers.URLField()

    def validate_url(self, value):
        pattern = r"https:\/\/player.vimeo.com\/texttrack\/(\d+)\.vtt\?token=(.+)"
        if not re.fullmatch(pattern, value):
            raise serializers.ValidationError("La 'url' no es una URL de TextTrack de Vimeo válida.")
        return value
    
class VTTContentSerializer(serializers.Serializer):
    """
    Valida que el 'value' sea un contenido VTT válido.
    Reemplaza a @require_vtt_value

    """
    value = serializers.CharField()

    def validate_value(self, data):
        pattern = r'(WEBVTT\s\n)?(\d+\n\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}\s.+\n*)+'
        if not re.fullmatch(pattern, data):
            raise serializers.ValidationError("El 'value' no es un contenido VTT válido.")
        return data