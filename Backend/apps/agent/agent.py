import os 
import vertexai
from agent_tools import extract_info_urls, count_tokens
from dotenv import load_dotenv
from langchain_google_vertexai import ChatVertexAI
from langchain_community.document_loaders import WebBaseLoader
from langchain_core.messages import HumanMessage, SystemMessage

load_dotenv()
location_l = os.getenv("LOCATION")
project_id = os.getenv("PROJECT_ID")
credential = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

result = extract_info_urls("https://player.vimeo.com/texttrack/252480080.vtt?token=6917bf62_0x827a567bbf6d5d5abedd63122ddd20a4ff106cd7")

tokens = count_tokens(result)

print(tokens)

prompt = f"""Analizaras el siguiente contenido y extraeras todo su contenido en formato Markdown.
        - Primero analizaras el contenido y lo diviras por capitulos importantes. 
        - Ahora con esa division por capitulos crearas un indice.
        - El indice debe tener los tiempos de Inicio y Fin (format: HH:MM:SS) del contenido original , no inventes tiempos, los colocaras al lado de cada titulo del indice.
        - Solo el responderas con el Indice generado, no mandes ningun mensaje adicional que no tenga que ver con el indice.
        """
#Finalmente despues del indice escribiras todo el contenido extraido respetando su estado original y coloando y respetando los tiempos del contenido original. Crearas los parrafos de los capitulos respentando el indice que creaste. TODO en formato Markdown.

prompt_markdown = f""""""

vertexai.init(project=project_id, location=location_l)

class AgenteP:
    def __init__(self, project: str, location: str) -> None:
        self.project_id = project
        self.location = location

    def set_up(self) -> None:
        self.model = ChatVertexAI(model_name="gemini-2.5-flash", temperature= 0.6)

    def query(self,system_input: str, input: str, media: str) -> None:
        # image_message = {
        #     "type": "image_url",
        #     "image_url": {"url": ""},
        # }
        
        message = [SystemMessage(content= system_input),
                HumanMessage(content=[input, media])]
        respuesta = self.model.invoke(message)
        return print(respuesta.content) 

agent_indice = AgenteP(project=project_id, location=location_l)
agent_indice.set_up()
result_indice = agent_indice.query(prompt, "Genera el indice del siguiente contenido:", result)

# agent_t_markdown = AgenteP(project=project_id, location=location_l)
# agent_t_markdown.set_up()
# agent_t_markdown.query(prompt, "Genera la transcripcion en formato Markdown del siguiente contenido:", result_indice)

prompt_txt = f"""
### Eres un asistente el cual tiene la funcion de extraer todo el contenido de una transcripcion y convertirla en un archivo de texto plano (.txt).
- El contenido extraido debe estar dividido en parrafos logicos segun el indice. 
- Obviaras las palabras de relleno como "uhm", "ahh"y demas expresiones comunes, ademas de palabras que se repitan mucho en una oracion, ejemplo: "Claro si si si, no no no", etc.
- Respeta los tiempos de inicio y fin (format: HH:MM:SS) del contenido original.
- Las lineas de tiempo deben estar ubicadas antes de cada parrafo correspondiente, ejemplo: 
'''
[HH:MM:SS]-[HH:MM:SS]
Contenido del parrafo correspondiente...
'''
- No inventes tiempos.
#INDICE:
{result_indice}
"""

agent_t_txt = AgenteP(project=project_id, location=location_l)
agent_t_txt.set_up()
agent_t_txt.query(prompt_txt, "Genera la transcripcion en formato txt del siguiente contenido:", result)