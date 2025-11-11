import os 
import json
import vertexai
from dotenv import load_dotenv
from langchain_google_vertexai import ChatVertexAI
from langchain_community.document_loaders import WebBaseLoader
from langchain_core.messages import HumanMessage, SystemMessage
import base64


loader = WebBaseLoader(web_paths=("https://www.youtube.com/watch?v=pIFqsjhVh5o",))
docs = loader.load()
print(docs)

# bs4_strainer = base64.SoupStrainer(class_=("post-title", "post-content"))
# loader = WebBaseLoader(
#     web_paths=("https://www.youtube.com/watch?v=r8-3Iv7XExE&t=154s",),
#     bs_kwargs={"parse_only": bs4_strainer}
# )

load_dotenv()
location_l = os.getenv("LOCATION")
project_id = os.getenv("PROJECT_ID")
credential = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

vertexai.init(project=project_id, location=location_l)

# class AgenteP:
#     def __init__(self, project: str, location: str) -> None:
#         self.project_id = project
#         self.location = location

#     def set_up(self) -> None:
#         self.model = ChatVertexAI(model_name="gemini-2.5-pro", temperature= 0.6)

#     def query(self, input: str):
#         image_message = {
#             "type": "image_url",
#             "image_url": {"url": "https://www.youtube.com/watch?v=r8-3Iv7XExE&t=154s"},
#         }              
#         message = [SystemMessage(content= "Analizaras el siguiente URL y extraeras todo su contenido en formato Json."),
#                 HumanMessage(content=[input, image_message])]
#         respuesta = self.model.invoke(message)
#         return print(respuesta.content) 



# agent = AgenteP(project=project_id, location=location_l)
# agent.set_up()
# agent.query("Analiza el siguiente URL y extrae todo su contenido en formato TXT.")