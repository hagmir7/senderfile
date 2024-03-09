from datetime import timedelta
from django.contrib.auth.decorators import login_required
from django.db.models import Count
from django.core.paginator import Paginator
from rest_framework import status
from django.views.generic import View
from rest_framework.parsers import MultiPartParser, FormParser
from django.http.response import JsonResponse
from django.shortcuts import get_object_or_404, render

from rest_framework.views import APIView
from .serializers import *
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import viewsets
from django.utils.translation import gettext_lazy as _
from django.forms.models import model_to_dict
from rest_framework.permissions import AllowAny

from file.models import *


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
