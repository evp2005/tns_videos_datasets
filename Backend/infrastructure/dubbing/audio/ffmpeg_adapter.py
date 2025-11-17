import subprocess

class FFmpegAdapter:
    """Adapter para operaciones con FFmpeg"""
    
    def extract_audio(self, video_path: str, output_audio_path: str) -> bool:
        """Extraer audio usando FFmpeg"""
        try:
            cmd = [
                'ffmpeg', '-i', video_path,
                '-q:a', '0', '-map', 'a',
                '-y', output_audio_path
            ]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
            return result.returncode == 0
        except Exception as e:
            print(f"❌ Error extrayendo audio con FFmpeg: {e}")
            return False
    
    def mix_audio_tracks(self, original_video_path: str, dubbed_audio_path: str, output_path: str) -> bool:
        """Mezclar pistas de audio"""
        try:
            cmd = [
                'ffmpeg', '-i', original_video_path, '-i', dubbed_audio_path,
                '-c:v', 'copy', '-map', '0:v:0', '-map', '1:a:0',
                '-shortest', '-y', output_path
            ]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
            return result.returncode == 0
        except Exception as e:
            print(f"❌ Error mezclando audio: {e}")
            return False