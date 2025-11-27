from core.ports.video_scraper import VideoScraper
from utils import selenium_utils
import traceback
import re
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from core.ports.video_scraper import VideoScraper
from utils import selenium_utils


class SeleniumVideoScraper(VideoScraper):
    def __init__(self):
        print("SCRAPER: Inicializando driver de Chrome...")
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920x1080")
        chrome_options.add_argument("log-level=3")
        
        service = Service() 
        self.driver = webdriver.Chrome(service=service, options=chrome_options)
        self.driver.implicitly_wait(10)

    def log(self, msg):
        print(f"[SCRAPER-DEBUG] {msg}")

    def get_texttrack_url(self, url: str) -> str | None:
        try:
            self.log("=== INICIO get_texttrack_url ===")
            self.log(f"URL recibida: {url}")

            self.driver = selenium_utils.get_chrome_driver()
            self.log("Driver creado correctamente")

            self.driver.set_page_load_timeout(60)
            self.driver.implicitly_wait(8)

            self.log("Navegando a la página...")
            self.driver.get(url)
            self.log("Página cargada correctamente")

            self.log("Buscando iframe del video...")
            iframe = selenium_utils.get_iframe_video(self.driver)
            self.log(f"Iframe encontrado: {iframe}")

            self.log("Cambiando al iframe...")
            self.driver.switch_to.frame(iframe)
            self.log("Cambio al iframe correcto")

            self.log("Buscando track VTT...")
            track_src = selenium_utils.get_track_src(self.driver)
            self.log(f"Track encontrado: {track_src}")

            self.log("=== FIN get_texttrack_url ===")
            return track_src

        except Exception as e:
            error_text = traceback.format_exc()
            self.log("******** ERROR EN get_texttrack_url ********")
            self.log(f"Mensaje: {str(e)}")
            self.log("Traceback completo:")
            self.log(error_text)
            raise e

        finally:
            if self.driver:
                self.log("Cerrando driver (get_texttrack_url)")
                try:
                    self.driver.quit()
                except:
                    self.log("Error cerrando el driver (ignorado)")


    def get_m3u8_url(self, page_url: str) -> dict:
        """
        Obtiene la URL del manifiesto M3U8 y el User-Agent del driver.
        Devuelve un diccionario: {'url': m3u8_url, 'user_agent': user_agent}
        """
        driver = None
        try:
            self.log("=== INICIO get_m3u8_url ===")
            self.log(f"URL recibida: {page_url}")

            driver = selenium_utils.get_chrome_driver()
            self.log("Driver creado correctamente para get_m3u8_url")

            driver.set_page_load_timeout(60)
            driver.implicitly_wait(8)

            self.log("Navegando a la página...")
            driver.get(page_url)
            self.log("Página cargada correctamente.")

            self.log("Buscando iframe del video...")
            iframe = selenium_utils.get_iframe_video(driver)
            self.log(f"Iframe encontrado: {iframe}")

            self.log("Cambiando al iframe...")
            driver.switch_to.frame(iframe)
            self.log("Cambio al iframe correcto")

            self.log("Buscando URL M3U8 en el código fuente del iframe...")
            page_source = driver.page_source
            match = re.search(r'(https://[^\'"]*vimeocdn\.com[^\'"]*\.m3u8[^\'"]*)', page_source)
            
            # Obtener el User-Agent del driver actual
            user_agent = driver.execute_script("return navigator.userAgent;")
            self.log(f"User-Agent detectado: {user_agent}")

            if match:
                m3u8_url = match.group(1)
                self.log(f"URL M3U8 (cruda) encontrada: {m3u8_url}")
                # 🔥 Decodificar la URL para corregir entidades como \u0026
                m3u8_url = m3u8_url.encode('utf-8').decode('unicode_escape')
                self.log(f"URL M3U8 (limpia) para FFmpeg: {m3u8_url}")
                # Devolvemos un diccionario con ambos datos
                return {'url': m3u8_url, 'user_agent': user_agent}
            else:
                self.log("ERROR: No se encontró la URL M3U8 con Regex en el source del iframe.")
                return None
        except Exception as e:
            self.log(f"******** ERROR EN get_m3u8_url: {e} ********")
            raise
        finally:
            if driver:
                self.log("Cerrando driver (get_m3u8_url)")
                driver.quit()

    # Añade este método dentro de la clase SeleniumVideoScraper
    def get_thumbnail_url(self, url: str) -> str | None:
        try:
            print("SCRAPER: Inicializando driver de Chrome para miniatura...")
            self.driver = selenium_utils.get_chrome_driver()
            self.driver.set_page_load_timeout(60)
            self.driver.implicitly_wait(8)

            print(f"SCRAPER: Navegando a la URL: {url}")
            self.driver.get(url)
            print("SCRAPER: Página cargada correctamente.")

            print("SCRAPER: Buscando el iframe del video...")
            iframe = selenium_utils.get_iframe_video(self.driver)
            print("SCRAPER: Iframe encontrado. Cambiando de contexto...")
            self.driver.switch_to.frame(iframe)
            print("SCRAPER: Contexto cambiado al iframe.")

            print("SCRAPER: Buscando la URL de la miniatura...")
            thumbnail_src = selenium_utils.get_thumbnail_src(self.driver)
            print(f"SCRAPER: URL de la miniatura encontrada: {thumbnail_src}")
            return thumbnail_src
        except Exception as e:
            print(f"SCRAPER ERROR en get_thumbnail_url: {e}")
            raise

    def get_title_url(self, url: str) -> str | None:
        try:
            print("SCRAPER: Inicializando driver de Chrome para duración...")
            self.driver = selenium_utils.get_chrome_driver()
            self.driver.set_page_load_timeout(60)
            self.driver.implicitly_wait(8)

            print(f"SCRAPER: Navegando a la URL: {url}")
            self.driver.get(url)
            print("SCRAPER: Página cargada correctamente.")

            # El título está en la página principal, no es necesario entrar al iframe.
            print("SCRAPER: Buscando el título...")
            title_src = selenium_utils.get_title_src(self.driver)
            print(f"SCRAPER: Título encontrado: {title_src}")
            return title_src
        except Exception as e:
            print(f"SCRAPER ERROR en get_title_url: {e}")
            raise
        
    def get_duration_url(self, url: str) -> str | None:
        try:
            print("SCRAPER: Inicializando driver de Chrome para duración...")
            self.driver = selenium_utils.get_chrome_driver()
            self.driver.set_page_load_timeout(60)
            self.driver.implicitly_wait(8)

            print(f"SCRAPER: Navegando a la URL: {url}")
            self.driver.get(url)
            print("SCRAPER: Página cargada correctamente.")

            print("SCRAPER: Buscando el iframe del video...")
            iframe = selenium_utils.get_iframe_video(self.driver)
            self.driver.switch_to.frame(iframe)
            print("SCRAPER: Contexto cambiado al iframe.")

            print("SCRAPER: Buscando la duración...")
            duration_src = selenium_utils.get_duration_src(self.driver)
            print(f"SCRAPER: Duración encontrada: {duration_src}")
            return duration_src
        except Exception as e:
            print(f"SCRAPER ERROR en get_duration_url: {e}")
            raise

    def get_video_details(self, url: str) -> dict | None:
        try:
            print("SCRAPER: Inicializando driver para obtener detalles completos...")
            self.driver = selenium_utils.get_chrome_driver()
            self.driver.set_page_load_timeout(60)
            self.driver.implicitly_wait(8)

            print(f"SCRAPER: Navegando a la URL: {url}")
            self.driver.get(url)
            print("SCRAPER: Página cargada correctamente.")

            # Obtener el título de la página principal
            title = self.driver.title.split("|")[0].strip()

            print("SCRAPER: Buscando el iframe del video...")
            iframe = selenium_utils.get_iframe_video(self.driver)
            self.driver.switch_to.frame(iframe)
            print("SCRAPER: Contexto cambiado al iframe.")

            # Obtener miniatura
            print("SCRAPER: Buscando la URL de la miniatura...")
            thumbnail_src = selenium_utils.get_thumbnail_src(self.driver)

            # Obtener duración (a través de la config del player)
            print("SCRAPER: Buscando scripts para la configuración del reproductor...")
            scripts = selenium_utils.get_scripts(self.driver)
            player_config = next((selenium_utils.get_player_config_from_script(s) for s in scripts if selenium_utils.get_player_config_from_script(s)), None)

            duration = "00:00"
            if player_config:
                duration_seconds = player_config.get("video", {}).get("duration", 0)
                minutes, seconds = divmod(duration_seconds, 60)
                duration = f"{int(minutes):02d}:{int(seconds):02d}"

            return {"title": title, "duration": duration, "miniature": thumbnail_src}
        except Exception as e:
            print(f"SCRAPER ERROR en get_video_details: {e}")
            return None
