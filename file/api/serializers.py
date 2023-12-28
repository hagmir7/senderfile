from django.urls import path, include
from django.contrib.auth.models import User
from rest_framework import routers, serializers, viewsets
from file.models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "is_superuser", "username", "first_name", "last_name", "email"]


class FolderSerializer(serializers.ModelSerializer):
    folder = serializers.PrimaryKeyRelatedField(queryset=Folder.objects.all(), required=False)
    files = serializers.PrimaryKeyRelatedField(queryset=File.objects.all(), required=False)

    class Meta:
        model = Folder
        fields = "__all__"


class FileSerializer(serializers.ModelSerializer):
    folder = FolderSerializer()
    user = UserSerializer()
    class Meta:
        model = File
        fields = "__all__"
