from apps.api.core.ports.video_scraper import VideoScraper
from apps.api.utils import selenium_utils # Puedes seguir usando tus utils aquí

class SeleniumVideoScraper(VideoScraper):
    def get_texttrack_url(self, url: str) -> str | None:
        driver = None
        try:
            driver = selenium_utils.get_chrome_driver()
            driver.implicitly_wait(8)
            driver.get(url)

            iframe = selenium_utils.get_iframe_video(driver)
            driver.switch_to.frame(iframe)

            return selenium_utils.get_track_src(driver)
        finally:
            if driver:
                driver.quit()

    def get_m3u8_url(self, url: str) -> str | None:
        driver = None
        try:
            driver = selenium_utils.get_chrome_driver()
            driver.implicitly_wait(8)
            driver.get(url)

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
                driver.quit()
