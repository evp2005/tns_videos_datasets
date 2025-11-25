from core.ports.video_scraper import VideoScraper
from utils import selenium_utils
import traceback

class SeleniumVideoScraper(VideoScraper):
    def __init__(self):
        self.driver = None

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


    def get_m3u8_url(self, url: str) -> str | None:
        try:
            print("SCRAPER: Inicializando driver de Chrome...")
            self.driver = selenium_utils.get_chrome_driver()
            self.driver.set_page_load_timeout(60)
            self.driver.implicitly_wait(8)
            print(f"SCRAPER: Navegando a la URL: {url}")
            self.driver.get(url)
            print("SCRAPER: Página cargada correctamente.")

            print("SCRAPER: Buscando el iframe del video...")
            iframe = selenium_utils.get_iframe_video(self.driver)
            self.driver.switch_to.frame(iframe)
            scripts = selenium_utils.get_scripts(self.driver)

            player_config = None
            for script in scripts:
                player_config = selenium_utils.get_player_config_from_script(script)
                if player_config is not None:
                    break
            
            if player_config:
                return selenium_utils.get_meu8_url_using_player_config(player_config)
            
            return None
        finally:
            if self.driver:
                print("SCRAPER: Cerrando el driver.")
                self.driver.quit()

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
