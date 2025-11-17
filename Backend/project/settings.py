import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# ============================
# STATIC & MEDIA
# ============================
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

STATIC_URL = "static/"

# ============================
# SECURITY
# ============================
SECRET_KEY = 'django-insecure-_dg*efch4h_ucb+d7jh!hk+(k25@1-#=*1k$l05dd0qh(*g#e!'
DEBUG = True

ALLOWED_HOSTS = [
    "127.0.0.1",
    "localhost",
]


# ============================
# APPS
# ============================
INSTALLED_APPS = [
    # Django core
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party
    'rest_framework',
    'corsheaders',

    # Internal
    'apps.api.apps.ApiAppConfig',
    'infrastructure.apps.InfrastructureConfig',
]


# ============================
# MIDDLEWARE
# ============================
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',

    # CORS DEBE IR AQUI ARRIBA
    'corsheaders.middleware.CorsMiddleware',

    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


# ============================
# CORS CONFIG
# ============================
# Permite tu frontend de Vite
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Permite cookies/sesiones si lo necesitas
CORS_ALLOW_CREDENTIALS = True

# Permitir headers que axios envía
CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

# Permitir métodos
CORS_ALLOW_METHODS = ["*"]


# ============================
# URLS / TEMPLATES / WSGI
# ============================
ROOT_URLCONF = 'project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'project.wsgi.application'


# ============================
# DATABASE
# ============================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'tcp_videos',
        'USER': 'root',
        'PASSWORD': '',
        'HOST': 'localhost',
        'PORT': '3306',
        'OPTIONS': {
            'sql_mode': 'STRICT_TRANS_TABLES',
        },
    }
}


# ============================
# AUTH & TIMEZONE
# ============================
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# ============================
# DJANGO DEFAULT
# ============================
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
