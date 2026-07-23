from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    target_exam = models.CharField(max_length=100, default='CRMEF Informatique')
    is_license_active = models.BooleanField(default=True)
    allowed_generations = models.IntegerField(default=5)
    account_type = models.CharField(max_length=20, default='Standard') # 'Standard' (Normale) ou 'Premium' (Illimité)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} ({self.email})"

class LicenseKey(models.Model):
    key_code = models.CharField(max_length=64, unique=True)
    is_used = models.BooleanField(default=False)
    assigned_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='used_keys')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.key_code} - {'Utilisée' if self.is_used else 'Disponible'}"
