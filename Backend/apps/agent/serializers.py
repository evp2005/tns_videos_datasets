from rest_framework import serializers

class SegmentSerializer(serializers.Serializer):
    """
    Serializer para un único segmento de video, con título, inicio y fin.
    """
    title = serializers.CharField()
    start = serializers.CharField()
    end = serializers.CharField()

class VideoSegmentationSerializer(serializers.Serializer):
    """
    Serializer para la solicitud de segmentación de video.
    Valida la URL del video y una lista de segmentos.
    """
    video_url = serializers.URLField()
    video_title = serializers.CharField(max_length=255)
    segments = serializers.ListField(
        child=SegmentSerializer()
    )