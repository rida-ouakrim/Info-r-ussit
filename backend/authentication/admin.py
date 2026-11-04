from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, LicenseKey, EmailVerificationCode

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'can_download_offline', 'account_type', 'is_staff', 'is_active')
    list_filter = ('can_download_offline', 'account_type', 'is_staff', 'is_active', 'target_exam')
    list_editable = ('can_download_offline',)
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Options Spéciales Concours & Hors-Ligne', {
            'fields': ('can_download_offline', 'target_exam', 'account_type', 'allowed_generations', 'is_license_active', 'is_archived', 'total_study_seconds')
        }),
    )

@admin.register(LicenseKey)
class LicenseKeyAdmin(admin.ModelAdmin):
    list_display = ('key_code', 'is_used', 'assigned_user', 'created_at')
    list_filter = ('is_used',)
    search_fields = ('key_code', 'assigned_user__username', 'assigned_user__email')

@admin.register(EmailVerificationCode)
class EmailVerificationCodeAdmin(admin.ModelAdmin):
    list_display = ('email', 'code', 'is_used', 'created_at')
    list_filter = ('is_used',)
    search_fields = ('email', 'code')
