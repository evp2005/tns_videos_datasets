from core.ports.video_scraper import VideoScraper
from utils import selenium_utils 

class SeleniumVideoScraper(VideoScraper):
    def __init__(self):
        self.driver = None
    
    def get_texttrack_url(self, url: str) -> str | None:
        try:
            print("SCRAPER: Inicializando driver de Chrome...")
            self.driver = selenium_utils.get_chrome_driver()
            # Aumentamos el tiempo de espera para la carga de la página a 60 segundos
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

            print("SCRAPER: Buscando la URL del track (VTT)...")
            track_src = selenium_utils.get_track_src(self.driver)
            print(f"SCRAPER: URL del track encontrada: {track_src}")
            return track_src
        except Exception as e:
            print(f"SCRAPER ERROR en get_texttrack_url: {e}")
            raise

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
