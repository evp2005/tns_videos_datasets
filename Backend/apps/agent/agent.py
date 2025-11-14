import os 
import vertexai
from token_count import count_tokens
from urls_extractor import extract_info_urls
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


vertexai.init(project=project_id, location=location_l)

class AgenteP:
    def __init__(self, project: str, location: str) -> None:
        self.project_id = project
        self.location = location

    def set_up(self) -> None:
        self.model = ChatVertexAI(model_name="gemini-2.5-pro", temperature= 0.6)

    def query(self, input: str):
        # image_message = {
        #     "type": "image_url",
        #     "image_url": {"url": "https://www.youtube.com/watch?v=r8-3Iv7XExE&t=154s"},
        # } 
        #Finalmente despues del indice escribiras todo el contenido extraido respetando su estado original y coloando y respetando los tiempos del contenido original. Crearas los parrafos de los capitulos respentando el indice que creaste. TODO en formato Markdown.             
        message = [SystemMessage(content= """Analizaras el siguiente contenido y extraeras todo su contenido en formato Markdown.
        Primero analizaras el contenido y lo diviras por capitulos. 
        Ahora con esa division por capitulos crearas un indice.
        """),
                HumanMessage(content=[input, result])]
        respuesta = self.model.invoke(message)
        return print(respuesta.content) 

agent = AgenteP(project=project_id, location=location_l)
agent.set_up()
agent.query("Analiza el siguiente URL y extrae todo su contenido en formato TXT.")