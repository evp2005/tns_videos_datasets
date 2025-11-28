import os 
import vertexai
from dotenv import load_dotenv
from langchain_google_vertexai import ChatVertexAI
from langchain_core.messages import HumanMessage, SystemMessage

load_dotenv()
location_l = os.getenv("LOCATION")
project_id = os.getenv("PROJECT_ID")


vertexai.init(project=project_id, location=location_l)

class AgenteP:
    def __init__(self) -> None:
        self.model = None

    def set_up(self) -> None:
        self.model = ChatVertexAI(model_name="gemini-2.5-pro", temperature= 0.6)

    def query(self, vtt_content: str):
        message = [
            SystemMessage(
                content=
"""
Analizaras el siguiente contenido y extraeras todo su contenido en formato Markdown.
Primero analizarás el contenido y lo diviras por capitulos. 
Ahora con esa division por capitulos crearas un indice.
Finalmente Crearas los parrafos de los capitulos respentando el indice que creaste. TODO en formato Markdown. 
Ademas colocaras una sección donde pondrás cada capitulo y su duración total en minutos y segundos en una sección llamada 'Duración por Capítulos' y tambien colocaras su tiempo de inicio y final en el video, y un valor más llamado importancia (baja, media y alta). 
Tambien colocaras una sección llamada 'Total de capitulos' donde pondrás el total de capitulos que tiene el video
Solo dame el contenido solicitado en formato Markdown sin ningun otro texto adicional o comentario tuyo
Ejemplo:
                                
## Índice

1.  Introducción
2.  Historia, Instalación y Usos
3.  Características Fundamentales
4.  Tipos de Datos
5.  Variables y Ejecución del Programa
6.  Estructuras de Control
7.  Operadores
8.  Funciones, Clases y Módulos
9.  Recursos para Seguir Aprendiendo y el Zen de Python
10. Despedida

## Duración por Capítulos

*   **Capítulo 1: Introducción**
    *   **Duración:** 0 minutos y 30 segundos
    *   **Inicio:** 00:00:00.080
    *   **Final:** 00:00:30.270
    *   **Importancia:** Baja

*   **Capítulo 2: Historia, Instalación y Usos**
    *   **Duración:** 1 minuto y 28 segundos
    *   **Inicio:** 00:00:33.680
    *   **Final:** 00:02:01.719
    *   **Importancia:** Alta

*   **Capítulo 3: Características Fundamentales**
    *   **Duración:** 1 minuto y 11 segundos
    *   **Inicio:** 00:02:01.719
    *   **Final:** 00:03:12.959
    *   **Importancia:** Media

*   **Capítulo 4: Tipos de Datos**
    *   **Duración:** 1 minuto y 17 segundos
    *   **Inicio:** 00:03:12.959
    *   **Final:** 00:04:29.759
    *   **Importancia:** Alta

*   **Capítulo 5: Variables y Ejecución del Programa**
    *   **Duración:** 1 minuto y 16 segundos
    *   **Inicio:** 00:04:29.759
    *   **Final:** 00:05:45.880
    *   **Importancia:** Media

*   **Capítulo 6: Estructuras de Control**
    *   **Duración:** 1 minuto y 11 segundos
    *   **Inicio:** 00:05:45.880
    *   **Final:** 00:06:57.000
    *   **Importancia:** Alta

*   **Capítulo 7: Operadores**
    *   **Duración:** 0 minutos y 29 segundos
    *   **Inicio:** 00:06:57.000
    *   **Final:** 00:07:26.039
    *   **Importancia:** Baja

*   **Capítulo 8: Funciones, Clases y Módulos**
    *   **Duración:** 0 minutos y 52 segundos
    *   **Inicio:** 00:07:26.039
    *   **Final:** 00:08:18.440
    *   **Importancia:** Media

*   **Capítulo 9: Recursos para Seguir Aprendiendo y el Zen de Python**
    *   **Duración:** 0 minutos y 59 segundos
    *   **Inicio:** 00:08:18.440
    *   **Final:** 00:09:17.710
    *   **Importancia:** Alta

*   **Capítulo 10: Despedida**
    *   **Duración:** 0 minutos y 21 segundos
    *   **Inicio:** 00:09:17.710
    *   **Final:** 00:09:39.200
    *   **Importancia:** Baja

                ---
etc...
"""
            ),
            HumanMessage(content=["Analiza el siguiente contenido de subtítulos VTT:", vtt_content]),
        ]
        respuesta = self.model.invoke(message)
        return respuesta.content