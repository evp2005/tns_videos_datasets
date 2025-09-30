from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password
from django.views.decorators.csrf import csrf_exempt
from .serializers import VideoSerializer
from django.http import JsonResponse
from rest_framework import viewsets
from .models import User, Video
import json

# Metodo GET
def get_users(request):
    users = User.objects.all().values()
    return JsonResponse(list(users), safe=False)

# Metodo POST
@csrf_exempt
def create_user(request):
    if request.method == "POST":
        data = json.loads(request.body)
        usr = User.objects.create(
            username=data["username"],
            password=make_password(data["password"]),
        )   
        return JsonResponse({"mensaje": "Usuario creado con exito", "id": usr.id})
    return JsonResponse({"error": "Método no permitido"}, status=405)

# Comprobar usuario y contraseña
@csrf_exempt
def login_user(request):
    if request.method == "POST":
        data = json.loads(request.body)
        
        try:
            usr = User.objects.get(username=data["username"])
        except User.DoesNotExist:
            return JsonResponse({"error": "Usuario no encontrado"}, status=404)
        
        if check_password(data["password"], usr.password):
            return JsonResponse({"mensaje": "Login correcto", "id": usr.id})
        else:
            return JsonResponse({"error": "Contraseña incorrecta"}, status=401)
    
    return JsonResponse({"error": "Método no permitido"}, status=405)

# Guardar videos desde frontend
class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    

