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

from file.models import *


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
