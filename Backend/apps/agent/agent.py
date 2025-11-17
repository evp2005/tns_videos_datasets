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
Finalmente despues del indice escribiras todo el contenido extraido respetando su estado original y colocando y respetando los tiempos del contenido original. Crearas los parrafos de los capitulos respentando el indice que creaste. TODO en formato Markdown. 
Ademas colocaras una sección donde pondrás cada capitulo y su duración total en minutos y segundos en una sección llamada 'Duración por Capítulos' y tambien colocaras su tiempo de inicio y final en el video. 
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

*   **Capítulo 2: Historia, Instalación y Usos**
    *   **Duración:** 1 minuto y 28 segundos
    *   **Inicio:** 00:00:33.680
    *   **Final:** 00:02:01.719

*   **Capítulo 3: Características Fundamentales**
    *   **Duración:** 1 minuto y 11 segundos
    *   **Inicio:** 00:02:01.719
    *   **Final:** 00:03:12.959

*   **Capítulo 4: Tipos de Datos**
    *   **Duración:** 1 minuto y 17 segundos
    *   **Inicio:** 00:03:12.959
    *   **Final:** 00:04:29.759

*   **Capítulo 5: Variables y Ejecución del Programa**
    *   **Duración:** 1 minuto y 16 segundos
    *   **Inicio:** 00:04:29.759
    *   **Final:** 00:05:45.880

*   **Capítulo 6: Estructuras de Control**
    *   **Duración:** 1 minuto y 11 segundos
    *   **Inicio:** 00:05:45.880
    *   **Final:** 00:06:57.000

*   **Capítulo 7: Operadores**
    *   **Duración:** 0 minutos y 29 segundos
    *   **Inicio:** 00:06:57.000
    *   **Final:** 00:07:26.039

*   **Capítulo 8: Funciones, Clases y Módulos**
    *   **Duración:** 0 minutos y 52 segundos
    *   **Inicio:** 00:07:26.039
    *   **Final:** 00:08:18.440

*   **Capítulo 9: Recursos para Seguir Aprendiendo y el Zen de Python**
    *   **Duración:** 0 minutos y 59 segundos
    *   **Inicio:** 00:08:18.440
    *   **Final:** 00:09:17.710

*   **Capítulo 10: Despedida**
    *   **Duración:** 0 minutos y 21 segundos
    *   **Inicio:** 00:09:17.710
    *   **Final:** 00:09:39.200

                ---

### 1. Introducción

[00:00:00.080 --> 00:00:13.400]
se puede aprender python en 5122 segundos Por supuesto que no pero te puedo contar todo lo que necesitas para comenzar a entender el lenguaje más popular de la actualidad y participar en conversaciones con otros programadores como si supieras de lo que estás hablando.

[00:00:13.400 --> 00:00:18.160]
bla bla bla python bla python bla bla python python python bla bla bla.

[00:00:18.160 --> 00:00:24.800]
python buf los nuevos vídeos venga que solo tenemos algo más de 8 minutos para descubrir su historia y fundamentos 2.

[00:00:24.800 --> 00:00:30.270]
elevado 9 2 asterisco asterisco nu Hala ya sabes Cómo representar exponentes en python.

[00:00:30.270 --> 00:00:33.399]
[Música]

### 2. Historia, Instalación y Usos

[00:00:33.680 --> 00:00:48.879]
python apareció oficialmente en 1991 y es posible que tenga más años que tú fue creado por guido van rossum uno de los grandes programadores de nuestra época y con el que tengo en común algo muy importante somos genios Bueno solo él pero a ambos nos gusta la cerveza.

[00:00:48.879 --> 00:00:57.680]
el nombre del lenguaje no tiene que ver nada con una serpiente la realidad es que a guido Le encantan los monti python y estaba todo el día viéndolos mientras desarrollaba el lenguaje.

[00:00:57.680 --> 00:01:10.200]
para instalar python y dar tus primeros pasos Solo tienes que entrar en python.org allí encontrarás todas las instrucciones y documentación si vas a la terminal escribes python 3 men menos version y aparece un número ya lo tendrás instalado.

etc...
"""
            ),
            HumanMessage(content=["Analiza el siguiente contenido de subtítulos VTT:", vtt_content]),
        ]
        respuesta = self.model.invoke(message)
        return respuesta.content