from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Pet, Appointment, Invoice
from .serializers import (RegisterSerializer, UserSerializer, PetSerializer,
                           AppointmentSerializer, InvoiceSerializer)


def get_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'message': 'Account created successfully.',
            'user': UserSerializer(user).data,
            'tokens': get_tokens(user),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email', '').strip().lower()
    password = request.data.get('password', '')

    if not email or not password:
        return Response(
            {'error': 'Email and password are required.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = authenticate(request, username=email, password=password)

    if user is None:
        return Response(
            {'error': 'Invalid email or password.'},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    return Response({
        'message': 'Login successful.',
        'user': UserSerializer(user).data,
        'tokens': get_tokens(user),
    }, status=status.HTTP_200_OK)


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
        qs = Appointment.objects.filter(user=request.user).select_related('pet', 'user')
        return Response(AppointmentSerializer(qs, many=True).data)

    # Validate the pet belongs to this user
    pet_id = request.data.get('pet')
    if not Pet.objects.filter(pk=pet_id, owner=request.user).exists():
        return Response({'error': 'Invalid pet.'}, status=status.HTTP_400_BAD_REQUEST)

    serializer = AppointmentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ── Dashboard summary ─────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    user = request.user
    pet_qs  = Pet.objects.filter(owner=user)
    appt_qs = Appointment.objects.filter(user=user).select_related('pet', 'user')

    # Use actual invoice amounts where available, fall back to $50 placeholder
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


# ── Staff: Appointment Management ─────────────────────────────────────

def _is_staff(request):
    return request.user.is_staff or request.user.is_superuser


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def staff_appointments(request):
    """List ALL appointments across all users (staff only)."""
    if not _is_staff(request):
        return Response({'error': 'Staff access required.'}, status=status.HTTP_403_FORBIDDEN)

    qs = (Appointment.objects
          .select_related('pet', 'user')
          .prefetch_related('invoice')
          .order_by('status', 'date', 'time'))
    return Response(AppointmentSerializer(qs, many=True).data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def staff_appointment_detail(request, pk):
    """Update status and/or doctor for any appointment (staff only)."""
    if not _is_staff(request):
        return Response({'error': 'Staff access required.'}, status=status.HTTP_403_FORBIDDEN)

    try:
        appt = Appointment.objects.select_related('pet', 'user').get(pk=pk)
    except Appointment.DoesNotExist:
        return Response({'error': 'Appointment not found.'}, status=status.HTTP_404_NOT_FOUND)

    allowed_fields = {'status', 'doctor', 'notes'}
    data = {k: v for k, v in request.data.items() if k in allowed_fields}

    serializer = AppointmentSerializer(appt, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ── Staff: Invoices ───────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def staff_invoices(request):
    """List all invoices (staff only)."""
    if not _is_staff(request):
        return Response({'error': 'Staff access required.'}, status=status.HTTP_403_FORBIDDEN)

    qs = Invoice.objects.select_related('appointment__pet', 'appointment__user').order_by('-created_at')
    return Response(InvoiceSerializer(qs, many=True).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def staff_invoice_create(request):
    """Create an invoice for an appointment (staff only)."""
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
    """Update an invoice (staff only)."""
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
