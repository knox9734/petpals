from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Pet, Appointment, Invoice, Doctor, DoctorEarning
from .serializers import (RegisterSerializer, UserSerializer, PetSerializer,
                           AppointmentSerializer, InvoiceSerializer,
                           DoctorSerializer, DoctorEarningSerializer)


def get_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {'refresh': str(refresh), 'access': str(refresh.access_token)}


def _is_staff(request):
    return request.user.is_staff or request.user.is_superuser


def _is_doctor(request):
    return hasattr(request.user, 'doctor_profile')


# ── Auth ──────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    staff_code = request.data.get('staff_code', '').strip()

    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()

        if staff_code:
            if staff_code == settings.STAFF_REGISTRATION_CODE:
                user.is_staff = True
                user.save(update_fields=['is_staff'])
            else:
                user.delete()
                return Response({'staff_code': 'Invalid staff registration code.'},
                                status=status.HTTP_400_BAD_REQUEST)

        return Response({
            'message': 'Account created successfully.',
            'user': UserSerializer(user).data,
            'tokens': get_tokens(user),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email    = request.data.get('email', '').strip().lower()
    password = request.data.get('password', '')

    if not email or not password:
        return Response({'error': 'Email and password are required.'},
                        status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, username=email, password=password)
    if user is None:
        return Response({'error': 'Invalid email or password.'},
                        status=status.HTTP_401_UNAUTHORIZED)

    return Response({
        'message': 'Login successful.',
        'user': UserSerializer(user).data,
        'tokens': get_tokens(user),
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        token = RefreshToken(request.data.get('refresh'))
        token.blacklist()
        return Response({'message': 'Logged out successfully.'})
    except Exception:
        return Response({'error': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    return Response(UserSerializer(request.user).data)


# ── Pets ──────────────────────────────────────────────────────────────

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def pets(request):
    if request.method == 'GET':
        qs = Pet.objects.filter(owner=request.user)
        return Response(PetSerializer(qs, many=True).data)

    serializer = PetSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(owner=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def pet_detail(request, pk):
    try:
        pet = Pet.objects.get(pk=pk, owner=request.user)
    except Pet.DoesNotExist:
        return Response({'error': 'Pet not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(PetSerializer(pet).data)
    if request.method == 'PUT':
        serializer = PetSerializer(pet, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    pet.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# ── Appointments ──────────────────────────────────────────────────────

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def appointments(request):
    if request.method == 'GET':
        qs = Appointment.objects.filter(user=request.user).select_related('pet', 'user', 'doctor_profile')
        return Response(AppointmentSerializer(qs, many=True).data)

    pet_id = request.data.get('pet')
    if not Pet.objects.filter(pk=pet_id, owner=request.user).exists():
        return Response({'error': 'Invalid pet.'}, status=status.HTTP_400_BAD_REQUEST)

    serializer = AppointmentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ── Dashboard ─────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    user    = request.user
    pet_qs  = Pet.objects.filter(owner=user)
    appt_qs = Appointment.objects.filter(user=user).select_related('pet', 'user', 'doctor_profile')

    total_spent = 0
    for a in appt_qs:
        if a.status == 'Completed':
            try:
                total_spent += float(a.invoice.amount)
            except Invoice.DoesNotExist:
                total_spent += 50

    upcoming = appt_qs.filter(status='Upcoming').order_by('date', 'time').first()

    return Response({
        'pets':         PetSerializer(pet_qs, many=True).data,
        'appointments': AppointmentSerializer(appt_qs, many=True).data,
        'total_spent':  total_spent,
        'upcoming':     AppointmentSerializer(upcoming).data if upcoming else None,
    })


# ── Staff: Appointments ───────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def staff_appointments(request):
    if not _is_staff(request):
        return Response({'error': 'Staff access required.'}, status=status.HTTP_403_FORBIDDEN)

    qs = (Appointment.objects
          .select_related('pet', 'user', 'doctor_profile__user')
          .prefetch_related('invoice')
          .order_by('status', 'date', 'time'))
    return Response(AppointmentSerializer(qs, many=True).data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def staff_appointment_detail(request, pk):
    if not _is_staff(request):
        return Response({'error': 'Staff access required.'}, status=status.HTTP_403_FORBIDDEN)

    try:
        appt = Appointment.objects.select_related('pet', 'user', 'doctor_profile__user').get(pk=pk)
    except Appointment.DoesNotExist:
        return Response({'error': 'Appointment not found.'}, status=status.HTTP_404_NOT_FOUND)

    # If a registered doctor is being assigned, sync the display name too
    data = dict(request.data)
    if 'doctor_profile' in data:
        try:
            doc = Doctor.objects.get(pk=data['doctor_profile'])
            data['doctor'] = str(doc)
        except Doctor.DoesNotExist:
            pass

    serializer = AppointmentSerializer(appt, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ── Staff: Invoices ───────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def staff_invoices(request):
    if not _is_staff(request):
        return Response({'error': 'Staff access required.'}, status=status.HTTP_403_FORBIDDEN)
    qs = Invoice.objects.select_related('appointment__pet', 'appointment__user').order_by('-created_at')
    return Response(InvoiceSerializer(qs, many=True).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def staff_invoice_create(request):
    if not _is_staff(request):
        return Response({'error': 'Staff access required.'}, status=status.HTTP_403_FORBIDDEN)
    appt_id = request.data.get('appointment')
    if Invoice.objects.filter(appointment_id=appt_id).exists():
        return Response({'error': 'Invoice already exists for this appointment.'},
                        status=status.HTTP_400_BAD_REQUEST)
    serializer = InvoiceSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def staff_invoice_detail(request, pk):
    if not _is_staff(request):
        return Response({'error': 'Staff access required.'}, status=status.HTTP_403_FORBIDDEN)
    try:
        invoice = Invoice.objects.get(pk=pk)
    except Invoice.DoesNotExist:
        return Response({'error': 'Invoice not found.'}, status=status.HTTP_404_NOT_FOUND)
    serializer = InvoiceSerializer(invoice, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ── Staff: Doctors ────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def staff_doctors(request):
    if not _is_staff(request):
        return Response({'error': 'Staff access required.'}, status=status.HTTP_403_FORBIDDEN)
    qs = Doctor.objects.select_related('user').prefetch_related('earnings').all()
    return Response(DoctorSerializer(qs, many=True).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def staff_doctor_create(request):
    if not _is_staff(request):
        return Response({'error': 'Staff access required.'}, status=status.HTTP_403_FORBIDDEN)

    email      = request.data.get('email', '').strip().lower()
    password   = request.data.get('password', '')
    first_name = request.data.get('first_name', '').strip()
    last_name  = request.data.get('last_name', '').strip()
    specialty  = request.data.get('specialty', 'General Veterinarian')
    phone      = request.data.get('phone', '')
    bio        = request.data.get('bio', '')

    if not email or not password:
        return Response({'error': 'Email and password are required.'},
                        status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(email=email).exists():
        return Response({'error': 'A user with this email already exists.'},
                        status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(
        username=email, email=email,
        first_name=first_name, last_name=last_name,
        password=password,
    )
    doctor = Doctor.objects.create(user=user, specialty=specialty, phone=phone, bio=bio)
    return Response(DoctorSerializer(doctor).data, status=status.HTTP_201_CREATED)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def staff_doctor_detail(request, pk):
    if not _is_staff(request):
        return Response({'error': 'Staff access required.'}, status=status.HTTP_403_FORBIDDEN)
    try:
        doctor = Doctor.objects.select_related('user').prefetch_related('earnings').get(pk=pk)
    except Doctor.DoesNotExist:
        return Response({'error': 'Doctor not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(DoctorSerializer(doctor).data)

    if request.method == 'PUT':
        # Update Doctor fields
        for field in ('specialty', 'phone', 'bio'):
            if field in request.data:
                setattr(doctor, field, request.data[field])
        doctor.save()
        # Optionally update the linked User's name
        user = doctor.user
        if 'first_name' in request.data:
            user.first_name = request.data['first_name']
        if 'last_name' in request.data:
            user.last_name = request.data['last_name']
        user.save()
        return Response(DoctorSerializer(doctor).data)

    # DELETE
    doctor.user.delete()  # cascades to Doctor
    return Response(status=status.HTTP_204_NO_CONTENT)


# ── Staff: Doctor Earnings ────────────────────────────────────────────

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def staff_earnings(request):
    if not _is_staff(request):
        return Response({'error': 'Staff access required.'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        qs = (DoctorEarning.objects
              .select_related('doctor__user', 'appointment__pet')
              .order_by('-date'))
        return Response(DoctorEarningSerializer(qs, many=True).data)

    serializer = DoctorEarningSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def staff_earning_detail(request, pk):
    if not _is_staff(request):
        return Response({'error': 'Staff access required.'}, status=status.HTTP_403_FORBIDDEN)
    try:
        earning = DoctorEarning.objects.get(pk=pk)
    except DoctorEarning.DoesNotExist:
        return Response({'error': 'Earning not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = DoctorEarningSerializer(earning, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    earning.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# ── Doctor Dashboard ──────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def doctor_dashboard(request):
    if not _is_doctor(request):
        return Response({'error': 'Doctor access required.'}, status=status.HTTP_403_FORBIDDEN)

    doctor  = request.user.doctor_profile
    appt_qs = (Appointment.objects
               .filter(doctor_profile=doctor)
               .select_related('pet', 'user'))
    earnings_qs = DoctorEarning.objects.filter(doctor=doctor).order_by('-date')

    total_earnings  = float(sum(e.amount for e in earnings_qs))
    upcoming_count  = appt_qs.filter(status='Upcoming').count()
    completed_count = appt_qs.filter(status='Completed').count()

    return Response({
        'doctor':           DoctorSerializer(doctor).data,
        'appointments':     AppointmentSerializer(appt_qs, many=True).data,
        'earnings':         DoctorEarningSerializer(earnings_qs, many=True).data,
        'total_earnings':   total_earnings,
        'upcoming_count':   upcoming_count,
        'completed_count':  completed_count,
        'total_appointments': appt_qs.count(),
    })
