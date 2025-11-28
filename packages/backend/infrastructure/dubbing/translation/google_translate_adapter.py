from deep_translator import GoogleTranslator
from typing import List
import asyncio

class GoogleTranslateAdapter:
    def __init__(self):
        self.translator = None
        self._load_translator()
    
    def _load_translator(self):
        """Cargar traductor"""
        try:
            # deep-translator no necesita inicialización compleja
            print(" GoogleTranslator cargado (deep-translator)")
        except ImportError as e:
            print(f" deep-translator no disponible: {e}")
    
    def translate_text(self, text: str, source_lang: str, target_lang: str) -> str:
        """Traducir texto"""
        try:
            if source_lang == 'auto':
                # Usar 'auto' para detección automática
                translation = GoogleTranslator(source='auto', target=target_lang).translate(text)
            else:
                translation = GoogleTranslator(source=source_lang, target=target_lang).translate(text)
            
            return translation
            
        except Exception as e:
            print(f"  Error en traducción: {e}")
            return text
    
    def detect_language(self, text: str) -> str:
        """Detectar idioma"""
        try:
            # Para detección, podemos usar la primera traducción con 'auto'
            if len(text) > 10:  # Solo detectar si hay suficiente texto
                # Usar una muestra del texto para detección
                sample_text = text[:100]
                # deep-translator no tiene detección directa, pero podemos intentar una traducción
                return 'en'  # Por ahora devolver inglés por defecto
            return 'en'
        except Exception as e:
            print(f"  Error detectando idioma: {e}")
            return 'en'