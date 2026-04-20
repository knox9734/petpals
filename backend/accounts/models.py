from django.db import models
from django.contrib.auth.models import User


class Pet(models.Model):
    SPECIES_CHOICES = [
        ('Dog', 'Dog'), ('Cat', 'Cat'), ('Bird', 'Bird'),
        ('Rabbit', 'Rabbit'), ('Fish', 'Fish'), ('Other', 'Other'),
    ]

    owner   = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pets')
    name    = models.CharField(max_length=100)
    species = models.CharField(max_length=50, choices=SPECIES_CHOICES)
    breed   = models.CharField(max_length=100, blank=True)
    age     = models.PositiveIntegerField(help_text='Age in years')
    weight  = models.DecimalField(max_digits=5, decimal_places=1, help_text='Weight in kg')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.owner.email})"


class Doctor(models.Model):
    SPECIALTY_CHOICES = [
        ('General Veterinarian', 'General Veterinarian'),
        ('Surgery',              'Surgery'),
        ('Dental Care',          'Dental Care'),
        ('Dermatology',          'Dermatology'),
        ('Oncology',             'Oncology'),
        ('Emergency Care',       'Emergency Care'),
        ('Other',                'Other'),
    ]

    user      = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    specialty = models.CharField(max_length=100, choices=SPECIALTY_CHOICES, default='General Veterinarian')
    phone     = models.CharField(max_length=20, blank=True)
    bio       = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        name = self.user.get_full_name()
        return f"Dr. {name}" if name else f"Dr. {self.user.email}"


class Appointment(models.Model):
    STATUS_CHOICES = [
        ('Upcoming', 'Upcoming'), ('Completed', 'Completed'), ('Cancelled', 'Cancelled'),
    ]
    SERVICE_CHOICES = [
        ('General Checkup', 'General Checkup'), ('Vaccination', 'Vaccination'),
        ('Surgery', 'Surgery'), ('Dental Care', 'Dental Care'),
        ('Grooming', 'Grooming'), ('Emergency Care', 'Emergency Care'), ('Other', 'Other'),
    ]

    user           = models.ForeignKey(User,   on_delete=models.CASCADE,  related_name='appointments')
    pet            = models.ForeignKey(Pet,    on_delete=models.CASCADE,  related_name='appointments')
    doctor_profile = models.ForeignKey(Doctor, on_delete=models.SET_NULL, related_name='appointments',
                                       null=True, blank=True)
    service  = models.CharField(max_length=100, choices=SERVICE_CHOICES)
    date     = models.DateField()
    time     = models.TimeField()
    doctor   = models.CharField(max_length=100, blank=True, default='TBD')   # display name (kept for backwards compat)
    status   = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Upcoming')
    notes    = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-time']

    def __str__(self):
        return f"{self.pet.name} — {self.service} on {self.date}"


class Invoice(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Paid',    'Paid'),
        ('Waived',  'Waived'),
    ]

    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE, related_name='invoice')
    amount      = models.DecimalField(max_digits=8, decimal_places=2)
    status      = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    notes       = models.TextField(blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"INV-{self.pk:04d} — {self.appointment}"


class DoctorEarning(models.Model):
    doctor      = models.ForeignKey(Doctor,      on_delete=models.CASCADE,  related_name='earnings')
    appointment = models.ForeignKey(Appointment, on_delete=models.SET_NULL, related_name='doctor_earning',
                                    null=True, blank=True)
    amount      = models.DecimalField(max_digits=8, decimal_places=2)
    date        = models.DateField()
    notes       = models.TextField(blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.doctor} — ${self.amount} on {self.date}"
