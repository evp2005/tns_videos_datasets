class GoogleTranslateAdapter:
    def __init__(self):
        self.translator = None
        self._load_translator()
    
    def _load_translator(self):
        """Cargar traductor"""
        try:
            from googletrans import Translator
            self.translator = Translator()
        except ImportError as e:
            print(f"❌ Googletrans no disponible: {e}")
            self.translator = None
    
    def translate_text(self, text: str, source_lang: str, target_lang: str) -> str:
        """Traducir texto"""
        try:
            if self.translator is None:
                return text
            
            if source_lang == 'auto':
                translation = self.translator.translate(text, dest=target_lang)
            else:
                translation = self.translator.translate(text, src=source_lang, dest=target_lang)
            
            return translation.text
            
        except Exception as e:
            print(f"⚠️  Error en traducción: {e}")
            return text
    
    def detect_language(self, text: str) -> str:
        """Detectar idioma"""
        try:
            if self.translator is None:
                return 'en'
            
            detection = self.translator.detect(text)
            return detection.lang
        except Exception as e:
            print(f"⚠️  Error detectando idioma: {e}")
            return 'en'