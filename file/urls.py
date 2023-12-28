from django.urls import path
from .views import *


urlpatterns = [
    path("", index, name="home"),
    path("dashboard", dashboard, name="dashboard"),
    path("file/upload", upload_file, name="upload_file"),
    path("upload/", upload, name="upload"),
]
