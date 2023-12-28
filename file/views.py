from django.shortcuts import render, redirect, get_object_or_404
from .models import Folder, File
from .forms import FolderForm, FileForm
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.core.paginator import Paginator


def index(request):
    return render(request, "index.html")


def dashboard(request):
    return render(request, "dashboard.html")


@login_required(login_url="login")
def create_folder(request):
    if request.method == "POST":
        form = FolderForm(request.POST)
        if form.is_valid():
            folder = form.save(commit=False)
            folder.user = request.user
            folder.save()
            return redirect("list_folders")
    else:
        form = FolderForm()
    return render(request, "file_manager/create_folder.html", {"form": form})


@login_required(login_url="login")
def upload_file(request, folder_id=None):
    if folder_id:
        folder = Folder.objects.get(pk=folder_id)
    else:
        folder = None

    if request.method == "POST":
        form = FileForm(request.POST, request.FILES)
        if form.is_valid():
            file = form.save(commit=False)
            file.user = request.user
            file.folder = folder if folder else None
            file.save()
            return redirect("dashboard")
    else:
        form = FileForm()
    return render(request, "file/upload.html", {"form": form, "folder": folder})


from django.http import JsonResponse


def upload(request):

    if request.method == "POST" and request.FILES.get("file"):  # Use get to avoid MultiValueDictKeyError
        uploaded_file = request.FILES["file"]
        new_file = File.objects.create(file=uploaded_file, user=request.user)
        return JsonResponse({"success": True, "message": "File uploaded successfully"})
    else:
        return JsonResponse({"success": False, "message": "No file or invalid request method"})
    


@login_required(login_url="login")
def list_folders(request):
    folders = Folder.objects.filter(user=request.user)
    return render(request, "file_manager/list_folders.html", {"folders": folders})


@login_required(login_url="login")
def list_files(request, folder_id):
    folder = Folder.objects.get(pk=folder_id)
    files = File.objects.filter(user=request.user, folder=folder)
    return render(
        request, "file_manager/list_files.html", {"folder": folder, "files": files}
    )
