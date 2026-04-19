from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Pet, Appointment
from .serializers import RegisterSerializer, UserSerializer, PetSerializer, AppointmentSerializer


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
        qs = Appointment.objects.filter(user=request.user).select_related('pet')
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
    appt_qs = Appointment.objects.filter(user=user).select_related('pet')

    total_spent = sum(
        50 for a in appt_qs if a.status == 'Completed'   # placeholder until billing model added
    )

    upcoming = appt_qs.filter(status='Upcoming').order_by('date', 'time').first()

    return Response({
        'pets':              PetSerializer(pet_qs, many=True).data,
        'appointments':      AppointmentSerializer(appt_qs, many=True).data,
        'total_spent':       total_spent,
        'upcoming':          AppointmentSerializer(upcoming).data if upcoming else None,
    })
