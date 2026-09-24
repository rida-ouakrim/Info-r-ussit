from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    target_exam = models.CharField(max_length=100, default='CRMEF Informatique')
    is_license_active = models.BooleanField(default=True)
    allowed_generations = models.IntegerField(default=5)
    account_type = models.CharField(max_length=20, default='Standard') # 'Standard' (Normale) ou 'Premium' (Illimité)
    total_study_seconds = models.IntegerField(default=0) # Temps réel d'étude accumulé en secondes
    last_active_at = models.DateTimeField(null=True, blank=True) # Horodatage de dernière activité pour statut En ligne
    is_archived = models.BooleanField(default=False) # Compte archivé (masqué dans la liste)
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

class EmailVerificationCode(models.Model):
    email = models.EmailField(db_index=True)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.email} - {self.code} ({'Utilisé' if self.is_used else 'Actif'})"
