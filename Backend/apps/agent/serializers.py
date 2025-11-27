from rest_framework import serializers

class GenerateClipsSerializer(serializers.Serializer):
    """
    Valida los datos para generar clips de video.
    """
    minutes_json = serializers.JSONField()
    video_path = serializers.CharField(max_length=500)
    output_name = serializers.CharField(max_length=255)

    def validate_video_path(self, value):
        # Podríamos validar si el archivo existe aquí, pero el método generate_clips ya lo hace.
        # Dejaremos que el método maneje la existencia del archivo para mantener la lógica allí.
        return value