from rest_framework import serializers

class DubbingRequestSerializer(serializers.Serializer):
    file = serializers.FileField(required=True)
    source_lang = serializers.CharField(default='auto')
    target_lang = serializers.CharField(required=True)
    use_edge_tts = serializers.BooleanField(default=True)
    