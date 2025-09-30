from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'video', views.VideoViewSet) 

urlpatterns = [
    path('users/get_users', views.get_users),
    path('users/create_user', views.create_user),
    path('users/login_user', views.login_user),
    path('save/', include(router.urls)),
]