import os

class GTTSAdapter:
    """Adapter para Google Text-to-Speech"""
    
    def synthesize_speech(self, text: str, output_path: str, language: str) -> bool:
        """Sintetizar voz con gTTS"""
        try:
            if not text.strip():
                return self._create_silence(output_path, 1.0)
            
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
            with open(output_path, 'wb') as f:
                f.write(b"silent_audio")
            return True
        except:
            return False