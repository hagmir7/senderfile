from .views import *
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

urlpatterns = [
    path("folders", folders),
    path("files", files),
    path("file/<str:slug>", file),
    path("upload/", upload, name="upload"),
    path("storage/token", createToken),
    path("storage/token/files/<str:token>", filesTokenList),
    path("posts", post_list),
    path("posts/create", post_create),
    path("posts/<str:slug>", post_detail),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
]
