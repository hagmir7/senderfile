from datetime import timedelta
from django.contrib.auth.decorators import login_required
from django.db.models import Count
from rest_framework import status
from django.views.generic import View
from rest_framework.parsers import MultiPartParser, FormParser
from django.http.response import JsonResponse
from django.shortcuts import get_object_or_404, render

from rest_framework.views import APIView
from .serializers import *
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework import viewsets
from django.utils.translation import gettext_lazy as _
from django.forms.models import model_to_dict
from rest_framework.permissions import AllowAny
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from file.models import *
from rest_framework.permissions import IsAuthenticated


# JWT Views
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token["username"] = user.username
        token["id"] = user.id
        token["avatar"] = user.profile.avatar.url
        token["is_superuser"] = user.is_superuser
        # ...

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(["POST"])
@permission_classes([AllowAny])
def createToken(request):
    if request.method == "POST":
        token = Token.objects.create()
        serializer = TokenSerializer(token, many=False)
        return Response({"token": serializer.data})
    else:
        return Response({"error": "Request is POST"})


@login_required(login_url="login")
def folders(request):
    folder_list = Folder.objects.filter(user=request.user)
    paginator = Paginator(folder_list, 25)  # Show 25 folders per page.
    page_number = request.GET.get("page")
    folders = paginator.get_page(page_number)

    serializer = FolderSerializer(folders, many=True)
    return JsonResponse({"folders": serializer.data, "has_next": folders.has_next()})


@login_required(login_url="login")
def files(request):
    files_list = File.objects.filter(user=request.user)
    paginator = Paginator(files_list, 25)  # Show 25 folders per page.
    page_number = request.GET.get("page")
    files = paginator.get_page(page_number)

    serializer = FileSerializer(files, many=True)
    return JsonResponse({"files": serializer.data, "has_next": files.has_next()})


@api_view(["GET"])
@permission_classes([AllowAny])
def file(request, slug):
    file_object = get_object_or_404(File, slug=slug)
    serializer = FileSerializer(file_object)
    return Response({"file": serializer.data})


@api_view(['GET'])
@permission_classes([AllowAny])
def filesTokenList(request, token):
    token_instance = get_object_or_404(Token, token=token)
    files = File.objects.filter(token_storage=token_instance)
    serializer = FileSerializer(files, many=True)  # Assuming you want many files serialized
    return Response({"files": serializer.data})


@api_view(["POST"])
@permission_classes([AllowAny])
def upload(request):
    if request.method == 'POST' and 'file' in request.FILES:
        token = get_object_or_404(Token, token=request.GET.get("token"))

        serializer = FileSerializer(data=request.FILES)  # Pass request.FILES for file upload
        if serializer.is_valid():
            serializer.save(token_storage=token)
            return Response({"file": serializer.data}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'status': 'file not found'}, status=status.HTTP_400_BAD_REQUEST)


#  Post Views


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([AllowAny])
def post_detail(request, slug):
    post = get_object_or_404(Post, slug=slug)
    if request.method == 'GET':
        serializer = PostSerializer(post)
        return Response(serializer.data)

    elif request.method == 'PUT':
        if request.user.is_superuser:
            serializer = PostSerializer(post, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)

    elif request.method == 'DELETE':
        if request.user.is_superuser:
            post.delete()
            return Response({"message": "Post deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)
from .authentication import ApiKeyAuthentication


@api_view(["GET"])
@permission_classes([IsAuthenticated])
# @authentication_classes([ApiKeyAuthentication])
def post_list(request):
    list = Post.objects.filter(language__code=(request.GET.get("lang")))
    paginator = Paginator(list, 10)
    try:
        posts = paginator.page(request.GET.get("page"))
    except (PageNotAnInteger):
        posts = paginator.page(1)
    except (EmptyPage):
        return Response({"data": [], "has_next": False})

    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def post_create(request):
    serializer = PostSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
