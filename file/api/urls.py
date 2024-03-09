from .views import *
from django.urls import path

urlpatterns = [
    path("folders", folders),
    path("files", files),
    path("file/<str:slug>", file),
    path("upload/", upload, name="upload"),
    path("storage/token", createToken),
    path("storage/token/files/<str:token>", filesTokenList),
]
