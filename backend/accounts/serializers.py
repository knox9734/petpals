from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import Pet, Appointment, Invoice


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'password', 'confirm_password')

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({'email': 'An account with this email already exists.'})
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(
            username=validated_data['email'],   # use email as username
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=validated_data['password'],
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email', 'is_staff')


class PetSerializer(serializers.ModelSerializer):
    owner_email = serializers.CharField(source='owner.email', read_only=True)
    owner_name  = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Pet
        fields = ('id', 'name', 'species', 'breed', 'age', 'weight', 'created_at',
                  'owner_email', 'owner_name')
        read_only_fields = ('id', 'created_at', 'owner_email', 'owner_name')

    def get_owner_name(self, obj):
        return f"{obj.owner.first_name} {obj.owner.last_name}".strip() or obj.owner.email


class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = ('id', 'appointment', 'amount', 'status', 'notes', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class AppointmentSerializer(serializers.ModelSerializer):
    pet_name    = serializers.CharField(source='pet.name',    read_only=True)
    pet_species = serializers.CharField(source='pet.species', read_only=True)
    owner_email = serializers.CharField(source='user.email',  read_only=True)
    owner_name  = serializers.SerializerMethodField(read_only=True)
    invoice     = InvoiceSerializer(read_only=True)

    class Meta:
        model = Appointment
        fields = ('id', 'pet', 'pet_name', 'pet_species', 'owner_email', 'owner_name',
                  'service', 'date', 'time', 'doctor', 'status', 'notes', 'created_at',
                  'invoice')
        read_only_fields = ('id', 'created_at', 'pet_name', 'pet_species',
                            'owner_email', 'owner_name', 'invoice')

    def get_owner_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.email
