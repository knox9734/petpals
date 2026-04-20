from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import Pet, Appointment, Invoice, Doctor, DoctorEarning


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
            username=validated_data['email'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=validated_data['password'],
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    is_doctor = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email', 'is_staff', 'is_doctor')

    def get_is_doctor(self, obj):
        return hasattr(obj, 'doctor_profile')


class DoctorSerializer(serializers.ModelSerializer):
    full_name  = serializers.SerializerMethodField()
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name  = serializers.CharField(source='user.last_name',  read_only=True)
    email      = serializers.CharField(source='user.email',      read_only=True)
    total_earnings = serializers.SerializerMethodField()

    class Meta:
        model = Doctor
        fields = ('id', 'full_name', 'first_name', 'last_name', 'email',
                  'specialty', 'phone', 'bio', 'total_earnings', 'created_at')
        read_only_fields = ('id', 'created_at', 'full_name', 'first_name',
                            'last_name', 'email', 'total_earnings')

    def get_full_name(self, obj):
        name = obj.user.get_full_name().strip()
        return f"Dr. {name}" if name else f"Dr. {obj.user.email}"

    def get_total_earnings(self, obj):
        return float(sum(e.amount for e in obj.earnings.all()))


class DoctorEarningSerializer(serializers.ModelSerializer):
    appointment_info = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = DoctorEarning
        fields = ('id', 'doctor', 'appointment', 'appointment_info',
                  'amount', 'date', 'notes', 'created_at')
        read_only_fields = ('id', 'created_at', 'appointment_info')

    def get_appointment_info(self, obj):
        if obj.appointment:
            return f"{obj.appointment.pet.name} — {obj.appointment.service} on {obj.appointment.date}"
        return None


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
    pet_name       = serializers.CharField(source='pet.name',    read_only=True)
    pet_species    = serializers.CharField(source='pet.species', read_only=True)
    owner_email    = serializers.CharField(source='user.email',  read_only=True)
    owner_name     = serializers.SerializerMethodField(read_only=True)
    invoice        = InvoiceSerializer(read_only=True)
    doctor_id      = serializers.IntegerField(source='doctor_profile.id',        read_only=True)
    doctor_name    = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Appointment
        fields = ('id', 'pet', 'pet_name', 'pet_species', 'owner_email', 'owner_name',
                  'service', 'date', 'time', 'doctor', 'doctor_profile', 'doctor_id',
                  'doctor_name', 'status', 'notes', 'created_at', 'invoice')
        read_only_fields = ('id', 'created_at', 'pet_name', 'pet_species',
                            'owner_email', 'owner_name', 'invoice', 'doctor_id', 'doctor_name')

    def get_owner_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.email

    def get_doctor_name(self, obj):
        if obj.doctor_profile:
            return str(obj.doctor_profile)
        return obj.doctor or None
