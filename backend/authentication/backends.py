from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()

class EmailOrUsernameModelBackend(ModelBackend):
    """
    Custom authentication backend allowing users to log in with EITHER
    their username OR their email address (case-insensitive).
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        if username is None:
            username = kwargs.get(User.USERNAME_FIELD)
        if not username or not password:
            return None

        clean_username = username.strip()

        try:
            user = User.objects.get(
                Q(username__iexact=clean_username) | Q(email__iexact=clean_username)
            )
        except User.DoesNotExist:
            return None
        except User.MultipleObjectsReturned:
            user = User.objects.filter(
                Q(username__iexact=clean_username) | Q(email__iexact=clean_username)
            ).first()

        if user and user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None
