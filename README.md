# Sistema de Creación de DataSets a través de la Transcripción de Videos

## 🚀 Visión General del Proyecto

Este proyecto tiene como objetivo principal desarrollar un sistema robusto para la creación automatizada de datasets a partir de la transcripción de contenido de video. La idea es facilitar la generación de conjuntos de datos estructurados que puedan ser utilizados para diversas aplicaciones, como el entrenamiento de modelos de Machine Learning, análisis de contenido, o búsqueda avanzada.

Actualmente, estamos en una fase de avance significativa, con la configuración base del backend y la infraestructura de la API ya establecidas.

## ✨ Estado Actual del Avance

Hasta la fecha, se ha logrado lo siguiente:

- **Configuración del Proyecto Django:** La estructura principal del proyecto Django (`trans_project`) está configurada y funcionando.
- **API RESTful:** Se ha integrado Django REST Framework (`rest_framework`) para construir una API RESTful, que será el punto de comunicación principal para interactuar con el sistema (por ejemplo, para subir videos, gestionar transcripciones y generar datasets).
- **Gestión de Medios:** El sistema está configurado para manejar y servir archivos multimedia (videos, etc.) a través de `MEDIA_URL` y `MEDIA_ROOT`, lo que es fundamental para el almacenamiento de los videos a procesar.
- **Base de Datos MySQL:** Se ha configurado la conexión con una base de datos MySQL (`tcp_videos`), que almacenará toda la información relevante del proyecto, incluyendo metadatos de videos, transcripciones y detalles de los datasets generados.
- **CORS Habilitado:** Se ha implementado `django-cors-headers` con `CORS_ALLOW_ALL_ORIGINS = True`, permitiendo la comunicación sin restricciones con clientes frontend desde cualquier origen durante la fase de desarrollo.
- **Aplicación `api`:** Se ha creado y registrado la aplicación `api` dentro del proyecto, que contiene toda la lógica de negocio. Se han implementado varias funcionalidades clave, expuestas a través de los endpoints detallados más abajo.

## 🛠️ Tecnologías Utilizadas

- **Backend:** Python 3.x, Django
- **API:** Django REST Framework
- **Base de Datos:** MySQL
- **Procesamiento de Video/Audio:** `moviepy`, `openai-whisper`
- **Web Scraping:** Selenium WebDriver (para interacción con navegadores).
- **Manejo de CORS:** `django-cors-headers`.

## 📋 Requisitos Previos

Antes de configurar el proyecto, asegúrate de tener instalado lo siguiente en tu sistema:

- **Python 3.x:** El lenguaje de programación principal.
- **FFmpeg:** Una herramienta de línea de comandos esencial para el procesamiento de audio y video. Es utilizada por `moviepy` para extraer el audio de los videos y por `whisper` para procesar los archivos de audio.
  - **En Windows:** Descárgalo desde el sitio oficial de FFmpeg y añade la carpeta `bin` a la variable de entorno PATH de tu sistema.
  - **En macOS (con Homebrew):** `brew install ffmpeg`
  - **En Linux (Debian/Ubuntu):** `sudo apt update && sudo apt install ffmpeg`

## ⚙️ Configuración y Ejecución (para desarrollo)

Para poner en marcha el proyecto localmente:

1.  **Clonar el repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd tns_videos_datasets/backend
    ```
2.  **Crear y activar un entorno virtual:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # En Linux/macOS
    venv\Scripts\activate     # En Windows
    ```
3.  **Instalar dependencias:**
    ```bash
    pip install -r requirements.txt # (Desde la carpeta backend/)
    ```
4.  **Configurar la base de datos:** Asegúrate de que tu servidor MySQL esté corriendo y que la base de datos `tcp_videos` exista, o créala.
5.  **Realizar migraciones:**
    ```bash
    python manage.py migrate
    ```
6.  **Ejecutar el servidor de desarrollo:**
    ```bash
    python manage.py runserver
    ```
    El servidor estará disponible en `http://127.0.0.1:8000/`.

## 🌐 API Endpoints

A continuación se detallan los endpoints implementados en la aplicación `api`. (Nota: las rutas son ejemplos y dependen de la configuración en `urls.py`).

### Gestión de Usuarios

- `GET /api/users/get_users`: Lista todos los usuarios registrados.
- `POST /api/users/create_user`: Crea un nuevo usuario. Requiere `username`, `email` y `password`.
- `POST /api/users/login_user`: Autentica a un usuario. Requiere `email` y `password`.

### Utilidades de EscuelaIT y Vimeo

- `POST /api/is-valid-escuelait-url`: Valida si una URL corresponde a una clase de EscuelaIT.

  - **Body:** `{ "url": "https://escuela.it/..." }`

- `POST /api/get-texttrack-url`: Obtiene la URL del archivo de subtítulos (VTT) de un video de EscuelaIT.

  - **Body:** `{ "url": "https://escuela.it/..." }`

- `POST /api/get-m3u8-url`: Obtiene la URL del stream de video (M3U8) de un video de EscuelaIT.
  - **Body:** `{ "url": "https://escuela.it/..." }`

### Procesamiento de Audio y Subtítulos (En proceso)

- `POST /api/save-audio-using-m3u8-url`: Descarga y guarda el audio de un stream M3U8 como un archivo `.m4a`.

  - **Body:** `{ "url": "https://...m3u8", "file_name": "nombre_del_archivo" }`

- `POST /api/get-vtt-content`: Descarga el contenido en crudo de un archivo de subtítulos VTT de Vimeo.

  - **Body:** `{ "url": "https://player.vimeo.com/texttrack/..." }`

- `POST /api/vtt-to-plain-text`: Convierte el contenido de un archivo VTT a texto plano, eliminando timestamps y metadatos.
  - **Body:** `{ "value": "WEBVTT..." }`

### Utilidades de YouTube

- `POST /api/is-valid-youtube-url`: Valida si una URL corresponde a un video de YouTube.

  - **Body:** `{ "url": "https://www.youtube.com/watch?v=..." }`

- `POST /api/get-youtube-transcript-json`: Obtiene la transcripción de un video de YouTube en formato JSON.

  - **Body:** `{ "url": "https://www.youtube.com/watch?v=..." }`

- `POST /api/get-youtube-transcript-vtt`: Obtiene la transcripción en formato WebVTT.

  - **Body:** `{ "url": "https://www.youtube.com/watch?v=..." }`

- `POST /api/get-youtube-transcript-srt`: Obtiene la transcripción en formato SRT.

  - **Body:** `{ "url": "https://www.youtube.com/watch?v=..." }`

- `POST /api/get-youtube-transcript-plain-text`: Obtiene la transcripción como texto plano.
  - **Body:** `{ "url": "https://www.youtube.com/watch?v=..." }`

### Transcripción de Archivos Locales

- `POST /api/transcribe-video-file/<video_id>/`: Inicia el proceso de transcripción para un video local ya subido.
  - **URL Param:** `video_id` (el ID del video en la base de datos).
  - **Descripción:** Extrae el audio del archivo de video, lo transcribe usando OpenAI Whisper y guarda el resultado en la base de datos. Este es un proceso que puede tardar varios minutos.

### Agente de IA para Procesamiento de Markdown

Estos endpoints utilizan el agente de IA para procesar la transcripción de un video y devolver un documento Markdown estructurado.

- `POST /agent/process-vtt-escuelait`: Procesa un video de EscuelaIT.

  - **Body:** `{ "url": "https://escuela.it/cursos/.../clase/..." }`

- `POST /agent/process-vtt-youtube`: Procesa un video de YouTube.
  - **Body:** `{ "url": "https://www.youtube.com/watch?v=..." }`

## Cómo Probar la Transcripción Local

Para probar el endpoint de transcripción de archivos locales, necesitas tener un registro de video en la base de datos que apunte a un archivo físico. Sigue estos pasos:

1.  **Coloca un video de prueba:**

    - Crea la carpeta `media/video/` dentro del directorio `backend/`.
    - Copia un archivo de video (ej. `test_video.mp4`) dentro de `backend/media/video/`.

2.  **Crea los registros en la BD con la Django Shell:**

    - Abre la shell de Django:
      ```bash
      python manage.py shell
      ```
    - Ejecuta el siguiente script para crear un usuario de prueba y un registro de video asociado a tu archivo.

      ```python
      from apps.api.models import User, Video
      from django.contrib.auth.hashers import make_password

      # Crear un usuario de prueba si no existe
      user, created = User.objects.get_or_create(
          username="testuser",
          defaults={'email': 'test@example.com', 'password': make_password('password123')}
      )

      # Crear el registro del video apuntando al archivo local
      video = Video.objects.create(title="Mi Video de Prueba", video_path="video/test_video.mp4", origin_video="local", user=user)
      print(f"Video creado con éxito. Su ID es: {video.id}")
      ```

    - Ten en cuenta el nombre del archivo al crearlo aqui: `video_path="video/test_video.mp4"`
    - Anota el ID del video que se imprime en la consola.

3.  **Ejecuta la petición:**
    - Usa una herramienta como Postman, Insomnia o `curl` para hacer una petición `POST` al endpoint, reemplazando `<video_id>` con el ID que obtuviste.
      ```bash
      # Ejemplo con curl
      curl -X POST http://127.0.0.1:8000/api/transcribe-video-file/1/
      ```
    - La transcripción puede tardar varios minutos. Una vez finalizada, puedes verificar el resultado en la tabla `api_transcription` de tu base de datos.

## ➡️ Próximos Pasos

Los siguientes pasos en el desarrollo incluyen:

- Definir los modelos de datos para videos, transcripciones y datasets.
- Refinar los `Serializers` y `Views` existentes, y añadir los necesarios para la gestión completa de recursos de videos y transcripciones.
- Integrar una librería o servicio de transcripción de audio/video más avanzado, o mejorar el procesamiento de VTT para una transcripción más robusta.
- Desarrollar la lógica para procesar videos, generar transcripciones estructuradas y organizar los datasets resultantes.
- Implementar la persistencia de los datos extraídos (URLs de texttrack, M3U8, contenido VTT, audio guardado) en la base de datos.
