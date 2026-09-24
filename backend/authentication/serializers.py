from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import LicenseKey, EmailVerificationCode

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'target_exam', 'is_staff', 'is_license_active', 'allowed_generations', 'account_type', 'is_archived', 'created_at')

class RegisterSerializer(serializers.ModelSerializer):
    verification_code = serializers.CharField(write_only=True, required=True)
    password = serializers.CharField(write_only=True, required=True, min_length=6)
    license_key = serializers.CharField(write_only=True, required=False, allow_blank=True, default='')

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'first_name', 'last_name', 'target_exam', 'verification_code', 'license_key')

    def validate(self, attrs):
        email = attrs.get('email', '').strip().lower()
        code = attrs.get('verification_code', '').strip()

        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError({"email": "Cet adresse e-mail est déjà associée à un compte."})

        code_obj = EmailVerificationCode.objects.filter(email__iexact=email, code=code, is_used=False).order_by('-created_at').first()
        if not code_obj:
            raise serializers.ValidationError({"verification_code": "Code de vérification invalide ou expiré."})

        attrs['code_obj'] = code_obj
        return attrs

    def create(self, validated_data):
        code_obj = validated_data.pop('code_obj')
        validated_data.pop('verification_code')
        validated_data.pop('license_key', None)
        password = validated_data.pop('password')
        
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()

        # Mark code as used
        code_obj.is_used = True
        code_obj.save()

        return user

class LicenseKeySerializer(serializers.ModelSerializer):
    assigned_username = serializers.CharField(source='assigned_user.username', read_only=True, default=None)

    class Meta:
        model = LicenseKey
        fields = ('id', 'key_code', 'is_used', 'assigned_username', 'created_at')
