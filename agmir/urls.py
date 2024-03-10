from django.contrib import admin
from django.urls import path, include
from rest_framework import routers, serializers, viewsets
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers
router = routers.DefaultRouter()

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("file.urls")),
    path("", include("users.urls")),
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include("file.api.urls")),
    path("api-all/", include(router.urls)),
]


urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
