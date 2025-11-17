import os
import asyncio

class EdgeTTSAdapter:
    def __init__(self):
        self.voice_map = {
            'es': 'es-ES-AlvaroNeural',
            'en': 'en-US-ChristopherNeural',
            'fr': 'fr-FR-HenriNeural',
            'de': 'de-DE-ConradNeural',
            'it': 'it-IT-DiegoNeural',
            'pt': 'pt-BR-AntonioNeural',
            'ja': 'ja-JP-KeitaNeural',
            'ko': 'ko-KR-InJoonNeural',
            'zh': 'zh-CN-YunxiNeural',
            'ru': 'ru-RU-DmitryNeural',
            'ar': 'ar-EG-SalmaNeural',
            'hi': 'hi-IN-MadhurNeural'
        }
    
    def synthesize_speech(self, text: str, output_path: str, language: str, use_edge_tts: bool = True) -> bool:
        """Sintetizar voz"""
        try:
            if not text.strip():
                return self._create_silence(output_path, 1.0)
            
            if use_edge_tts:
                return self._synthesize_with_edge_tts(text, output_path, language)
            else:
                return self._synthesize_with_gtts(text, output_path, language)
            
        except Exception as e:
            print(f"❌ Error sintetizando voz: {e}")
            return False
    
    def _synthesize_with_edge_tts(self, text: str, output_path: str, language: str) -> bool:
        """Sintetizar con Edge TTS"""
        try:
            import edge_tts
            
            voice = self.voice_map.get(language, 'en-US-ChristopherNeural')
            
            async def generate():
                communicate = edge_tts.Communicate(text, voice)
                await communicate.save(output_path)
                return True
            
            success = asyncio.run(generate())
            return success and os.path.exists(output_path)
            
        except Exception as e:
            print(f"❌ Error con Edge TTS: {e}")
            return self._synthesize_with_gtts(text, output_path, language)
    
    def _synthesize_with_gtts(self, text: str, output_path: str, language: str) -> bool:
        """Sintetizar con gTTS (fallback)"""
        try:
            from gtts import gTTS
            
            lang_map = {
                'es': 'es', 'en': 'en', 'fr': 'fr', 'de': 'de',
                'it': 'it', 'pt': 'pt', 'ja': 'ja', 'ko': 'ko',
                'zh': 'zh-cn', 'ru': 'ru', 'ar': 'ar', 'hi': 'hi'
            }
            
            tts_lang = lang_map.get(language, 'en')
            tts = gTTS(text=text, lang=tts_lang, slow=False)
            tts.save(output_path)
            return os.path.exists(output_path)
            
        except Exception as e:
            print(f"❌ Error con gTTS: {e}")
            return False
    
    def _create_silence(self, output_path: str, duration: float) -> bool:
        """Crear archivo de silencio"""
        try:
            # Implementación simplificada
            with open(output_path, 'wb') as f:
                f.write(b"silent_audio")
            return True
        except:
            return False