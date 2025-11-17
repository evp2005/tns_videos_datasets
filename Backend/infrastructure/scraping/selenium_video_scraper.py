from core.ports.video_scraper import VideoScraper
from utils import selenium_utils 

class SeleniumVideoScraper(VideoScraper):
    def get_texttrack_url(self, url: str) -> str | None:
        driver = None
        try:
            print("SCRAPER: Inicializando driver de Chrome...")
            driver = selenium_utils.get_chrome_driver()
            # Aumentamos el tiempo de espera para la carga de la página a 60 segundos
            driver.set_page_load_timeout(60)
            driver.implicitly_wait(8)

            print(f"SCRAPER: Navegando a la URL: {url}")
            driver.get(url)
            print("SCRAPER: Página cargada correctamente.")

            print("SCRAPER: Buscando el iframe del video...")
            iframe = selenium_utils.get_iframe_video(driver)
            print("SCRAPER: Iframe encontrado. Cambiando de contexto...")
            driver.switch_to.frame(iframe)
            print("SCRAPER: Contexto cambiado al iframe.")

            print("SCRAPER: Buscando la URL del track (VTT)...")
            track_src = selenium_utils.get_track_src(driver)
            print(f"SCRAPER: URL del track encontrada: {track_src}")
            return track_src
        except Exception as e:
            print(f"SCRAPER ERROR en get_texttrack_url: {e}")
            raise # Volvemos a lanzar la excepción para que el resto del sistema la maneje
        finally:
            if driver:
                print("SCRAPER: Cerrando el driver.")
                driver.quit()

    def get_m3u8_url(self, url: str) -> str | None:
        driver = None
        try:
            print("SCRAPER: Inicializando driver de Chrome...")
            driver = selenium_utils.get_chrome_driver()
            driver.set_page_load_timeout(60)
            driver.implicitly_wait(8)
            print(f"SCRAPER: Navegando a la URL: {url}")
            driver.get(url)
            print("SCRAPER: Página cargada correctamente.")

            print("SCRAPER: Buscando el iframe del video...")
            iframe = selenium_utils.get_iframe_video(driver)
            driver.switch_to.frame(iframe)
            scripts = selenium_utils.get_scripts(driver)

            player_config = None
            for script in scripts:
                player_config = selenium_utils.get_player_config_from_script(script)
                if player_config is not None:
                    break
            
            if player_config:
                return selenium_utils.get_meu8_url_using_player_config(player_config)
            
            return None
        finally:
            if driver:
                print("SCRAPER: Cerrando el driver.")
                driver.quit()
