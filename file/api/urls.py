from .views import *
from django.urls import path

urlpatterns = [
    path("folders", folders),
    path("files", files),
]
