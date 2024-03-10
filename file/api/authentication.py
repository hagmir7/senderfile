from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from file.models import ApiKey
from rest_framework import status
from rest_framework.response import Response
from django.utils.translation import gettext_lazy as _


class ApiKeyAuthentication(BaseAuthentication):
    def authenticate(self, request):
        key = request.headers.get("SENDERFILE-API-KEY")

        if not key:
            raise AuthenticationFailed(
                "Please submit your request using the SENDER FILE API KEY."
            )

        try:
            api_key = ApiKey.objects.get(key=key)
            if not api_key.status:
                raise AuthenticationFailed("API KEY is not valid.")
        except ApiKey.DoesNotExist:
            raise AuthenticationFailed("API KEY is not valid.")

        return (api_key.user, None)
