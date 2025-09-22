from django.urls import path
from . import views

urlpatterns = [
    path('users/get_users', views.get_users),
    path('users/create_user', views.create_user),
    path('users/login_user', views.login_user),
]