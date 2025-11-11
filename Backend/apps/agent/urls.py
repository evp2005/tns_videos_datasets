from django.urls import path
from .views import get_title_from_url

urlpatterns = [
    path('get-title/', get_title_from_url, name='get_title_from_url'),
]