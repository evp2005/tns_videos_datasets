from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/', include('apps.api.urls')),

    path('agent/', include('apps.agent.urls')),
<<<<<<< HEAD
=======

    path('api/dubbing/', include('apps.dubbing.urls')),
>>>>>>> 3efabdec4f2409c464685cd8566572db2d2fc4f6
]
if settings.DEBUG: 
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
