from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
from django.utils.crypto import get_random_string
import uuid
import os
import urllib.parse
import random
import string


def random_str():
    chars = string.ascii_letters + string.digits
    return "".join(random.choices(chars, k=10)).upper()


def random_slug():
    # Generate a UUID
    random_uuid = uuid.uuid4()
    # Convert UUID to a string and slugify it
    slug = slugify(str(random_uuid))
    return slug


def filename(instance, filename):
    ext = filename.split(".")[-1]  # Get the file extension
    new_filename = f"{uuid.uuid4().hex}.{ext}"
    model_name = str(instance._meta.model_name).lower() + 's'
    path = os.path.join(str(instance.user.username) if instance.user else '', model_name, ext.upper())
    return os.path.join(path, new_filename)


files = [
    "JPEG",
    "PNG",
    "SVG",
    "JPG",
    "GIF",
    "TIFF",
    "WEBP",
    "PDF",
    "TXT",
    "JSON",
    "HTML",
    "CSS",
]


class ApiKey(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    status = models.BooleanField(default=False, null=True, blank=True)
    key = models.UUIDField(default=uuid.uuid4, unique=True)  # editable=False

    def __str__(self):
        return str(self.key)


class Folder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    parent_folder = models.ForeignKey("self", null=True, blank=True, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        if not self.slug:
            random = get_random_string(length=5)
            self.slug = slugify(self.name + "-" + str(random))
        super(Folder, self).save(*args, **kwargs)

    def __str__(self):
        return self.name


class Token(models.Model):
    token = models.CharField(max_length=400, default=random_slug, unique=True)
    created = models.DateTimeField("Date", auto_now_add=True)

    def __str__(self):
        return self.token


class File(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField("Name", max_length=150, null=True, blank=True)
    file = models.FileField(upload_to=filename)
    slug = models.SlugField("Slug", null=True, blank=True, default=random_str)
    folder = models.ForeignKey(Folder, on_delete=models.CASCADE, null=True, blank=True)
    created = models.DateTimeField("Date", auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    type = models.CharField(max_length=20, null=True, blank=True)
    size = models.CharField(max_length=20, null=True, blank=True)
    token_storage = models.ForeignKey(Token, on_delete=models.CASCADE, null=True, blank=True)

    def get_size(self):
        if self.file:
            size_in_bytes = self.file.size
            if size_in_bytes >= 1e6:
                return f"{round(size_in_bytes / 1e6, 2)} MB"
            else:
                return f"{round(size_in_bytes / 1000, 2)} KB"
        return ""

    def is_image(self):
        image_extensions = ['jpg', 'jpeg', 'png', 'gif']  # Update with your supported image extensions
        ext = self.file.name.split('.')[-1].lower()
        return ext in image_extensions

    def get_type(self):
        if self.file:
            return self.file.name.split(".")[-1].upper()
        return ""

    def get_name(self):
        if self.file:
            self.name = urllib.parse.unquote(os.path.splitext(os.path.basename(self.file.name))[0])

    def get_slug(self):
        if not self.slug and self.name:
            random = get_random_string(length=5).upper()
            self.slug = slugify(self.name + "-" + random)

    def save(self, *args, **kwargs):
        self.type = self.get_type()
        self.size = self.get_size()
        self.get_name()
        self.get_slug()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name if self.name else str(self.id)

    class Meta:
        verbose_name = "File"
        verbose_name_plural = "Files"


class Language(models.Model):
    name = models.CharField(max_length=30)
    code = models.CharField(max_length=5, unique=True)

    def __str__(self):
        return self.name


class PostCategory(models.Model):
    name = models.CharField(max_length=200)
    language = models.ForeignKey(Language, on_delete=models.CASCADE ,blank=True, null=True)
    slug = models.SlugField(unique=True, auto_created=True, null=True, blank=True)

    def save(self, *args, **kwargs):
        random = get_random_string(length=5)
        if not self.slug:
            self.slug = slugify(f"{str(self.name)}-{str(random)}" )
        super(PostCategory, self).save(*args, **kwargs)

    def __str__(self):
        return self.name


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1, related_name='posts')
    title = models.CharField(max_length=150, blank=True, null=True)
    image = models.ImageField(upload_to=filename, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    body = models.TextField(verbose_name='Body ',blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True, blank=True)
    updated = models.DateTimeField(auto_now=True)
    category = models.ForeignKey(PostCategory, on_delete=models.PROTECT, blank=True, null=True)
    tags = models.CharField(max_length=150, null=True, blank=True)
    language = models.ForeignKey(Language, on_delete=models.CASCADE ,blank=True, null=True)
    slug = models.SlugField(blank=True, null=True, max_length=200)
    is_public = models.BooleanField(default=True)
        
        
    class Meta:
        ordering = ['-created']


    def get_absolute_url(self):
        return f'/blogs/{self.slug}'


    def save(self, *args, **kwargs):
        random = get_random_string(length=5)
        if not self.slug:
            self.slug = slugify(f"{str(self.title)}-{str(random)}" )
        super(Post, self).save(*args, **kwargs)
    

    def next(self):
        return self.get_next_by_created()


    def pre(self):
        return self.get_previous_by_created()
    

    def __str__(self):
        return str(self.title)


class PostComment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_comment')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='post_comment')
    body = models.TextField(max_length=400)
    created = models.DateTimeField(auto_now=True,)
    updated = models.DateTimeField(auto_now_add=True)


    class Meta:
        ordering = ['-created']
    

    def __str__(self):
        return f"{self.user} Comment at {self.post.user.username}'s Post"


class Subscribe(models.Model):
    email = models.EmailField(max_length=100)
    full_name = models.CharField(max_length=100, null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.email


class FileRaport(models.Model):
    name = models.CharField(max_length=200)
    file = models.ForeignKey(File, on_delete=models.CASCADE, related_name="file_raport")
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name
