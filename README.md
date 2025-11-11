
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
- **Web Scraping:** Selenium WebDriver (para interacción con navegadores).
- **Manejo de CORS:** `django-cors-headers`.

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
    pip install -r requirements.txt # (Asumiendo que existe un requirements.txt)
    # Si no existe, instalar manualmente:
    # pip install Django djangorestframework mysqlclient django-cors-headers
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

- `GET /api/users/`: Lista todos los usuarios registrados.
- `POST /api/users/create/`: Crea un nuevo usuario. Requiere `username`, `email` y `password`.
 http://127.0.0.1:8000/apps/api/users/create_user
- `POST /api/login/`: Autentica a un usuario. Requiere `email` y `password`.

### Utilidades de EscuelaIT y Vimeo

- `POST /api/is_valid_escuelait_url/`: Valida si una URL corresponde a una clase de EscuelaIT.

  - **Body:** `{ "url": "https://escuela.it/..." }`

- `POST /api/get_texttrack_url/`: Obtiene la URL del archivo de subtítulos (VTT) de un video de EscuelaIT.

  - **Body:** `{ "url": "https://escuela.it/..." }`

- `POST /api/get_m3u8_url/`: Obtiene la URL del stream de video (M3U8) de un video de EscuelaIT.
  - **Body:** `{ "url": "https://escuela.it/..." }`

### Procesamiento de Audio y Subtítulos

- `POST /api/save_audio_using_m3u8_url/`: Descarga y guarda el audio de un stream M3U8 como un archivo `.m4a`.

  - **Body:** `{ "url": "https://...m3u8", "file_name": "nombre_del_archivo" }`

- `POST /api/get_vtt_content/`: Descarga el contenido en crudo de un archivo de subtítulos VTT de Vimeo.

  - **Body:** `{ "url": "https://player.vimeo.com/texttrack/..." }`

- `POST /api/vtt_to_plain_text/`: Convierte el contenido de un archivo VTT a texto plano, eliminando timestamps y metadatos.
  - **Body:** `{ "value": "WEBVTT..." }`

## ➡️ Próximos Pasos

Los siguientes pasos en el desarrollo incluyen:

- Definir los modelos de datos para videos, transcripciones y datasets.
... (5 líneas restantes)
Subir Video
http://127.0.0.1:8000/apps/api/users/upload_video

{
  "title": "Video de ejemplo",
  "origin_video": "YouTube",
  "duration": "01:23:45",
  "state": "Pending",
  "language": "Español",
  "url_video": "https://ejemplo.com/video.mp4",
  "user_id": 1
}