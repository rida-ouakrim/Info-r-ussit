from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import LicenseKey

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'target_exam', 'is_staff', 'is_license_active', 'allowed_generations', 'created_at')

class RegisterSerializer(serializers.ModelSerializer):
    license_key = serializers.CharField(write_only=True, required=True)
    password = serializers.CharField(write_only=True, required=True, min_length=6)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'first_name', 'last_name', 'target_exam', 'license_key')

    def validate_license_key(self, value):
        key_obj = LicenseKey.objects.filter(key_code=value.strip()).first()
        if not key_obj:
            raise serializers.ValidationError("Clé d'accès invalide. Veuillez vérifier la clé fournie.")
        if key_obj.is_used:
            raise serializers.ValidationError("Cette clé d'accès a déjà été utilisée par un autre compte.")
        return value

    def create(self, validated_data):
        license_key_str = validated_data.pop('license_key')
        password = validated_data.pop('password')
        
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()

        # Bind and mark license key as used
        key_obj = LicenseKey.objects.filter(key_code=license_key_str.strip()).first()
        if key_obj:
            key_obj.is_used = True
            key_obj.assigned_user = user
            key_obj.save()

        return user

class LicenseKeySerializer(serializers.ModelSerializer):
    assigned_username = serializers.CharField(source='assigned_user.username', read_only=True, default=None)

    class Meta:
        model = LicenseKey
        fields = ('id', 'key_code', 'is_used', 'assigned_username', 'created_at')
