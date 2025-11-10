from django.test import TestCase
from unittest.mock import Mock
from .core.services import get_texttrack_url_from_page, VideoProcessingError
from .core.ports.video_scraper import VideoScraper

class CoreServicesTests(TestCase):

    def test_get_texttrack_url_from_page_success(self):
        """
        Prueba que el caso de uso devuelve la URL correctamente cuando el scraper la encuentra.
        """
        # 1. Arrange: Preparar el escenario de la prueba
        
        # Creamos un mock que simula ser un VideoScraper
        mock_scraper = Mock(spec=VideoScraper)
        
        # Configuramos el mock: cuando se llame a get_texttrack_url, debe devolver esta URL
        expected_url = "https://fake-vimeo.com/texttrack/12345.vtt"
        mock_scraper.get_texttrack_url.return_value = expected_url

        # 2. Act: Ejecutar la lógica que queremos probar
        result_url = get_texttrack_url_from_page("https://escuela.it/curso/clase", scraper=mock_scraper)

        # 3. Assert: Verificar que el resultado es el esperado
        self.assertEqual(result_url, expected_url)
        # Verificamos que el método del scraper fue llamado una vez con la URL correcta
        mock_scraper.get_texttrack_url.assert_called_once_with("https://escuela.it/curso/clase")

    def test_get_texttrack_url_from_page_failure(self):
        """
        Prueba que el caso de uso lanza una excepción si el scraper no encuentra la URL.
        """
        # Arrange: Configuramos el mock para que devuelva None, simulando que no encontró nada
        mock_scraper = Mock(spec=VideoScraper)
        mock_scraper.get_texttrack_url.return_value = None

        # Act & Assert: Verificamos que se lanza la excepción VideoProcessingError
        with self.assertRaises(VideoProcessingError):
            get_texttrack_url_from_page("https://escuela.it/curso/clase", scraper=mock_scraper)
