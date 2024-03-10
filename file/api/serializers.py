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


class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = "__all__"


class FileSerializer(serializers.ModelSerializer):
    folder = FolderSerializer(required=False)
    user = UserSerializer(required=False)
    token_storage = TokenSerializer(required=False)

    class Meta:
        model = File
        fields = "__all__"


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = "__all__"

class PostCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostComment
        fields = "__all__"


class PostCategorySerializer(serializers.ModelSerializer):
    language = LanguageSerializer(required=False)
    user = UserSerializer(required=False)
    comments = PostCommentSerializer(many=True, read_only=True)
    class Meta:
        model = PostCategory
        fields = "__all__"


class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=False)
    category = PostCategorySerializer(required=False)
    language = LanguageSerializer(required=False)
    class Meta:
        model = Post
        fields = "__all__"


class SubscribeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscribe
        fields = "__all__"


class FileRaportSerializer(serializers.ModelSerializer):
    file = FileSerializer(required=False)
    class Meta:
        model = FileRaport
        fields = "__all__"


class ApiKeySerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = ApiKey
        fields = ("__all__")
