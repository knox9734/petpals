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


class Appointment(models.Model):
    STATUS_CHOICES = [
        ('Upcoming', 'Upcoming'), ('Completed', 'Completed'), ('Cancelled', 'Cancelled'),
    ]
    SERVICE_CHOICES = [
        ('General Checkup', 'General Checkup'), ('Vaccination', 'Vaccination'),
        ('Surgery', 'Surgery'), ('Dental Care', 'Dental Care'),
        ('Grooming', 'Grooming'), ('Emergency Care', 'Emergency Care'), ('Other', 'Other'),
    ]

    user    = models.ForeignKey(User, on_delete=models.CASCADE, related_name='appointments')
    pet     = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='appointments')
    service = models.CharField(max_length=100, choices=SERVICE_CHOICES)
    date    = models.DateField()
    time    = models.TimeField()
    doctor  = models.CharField(max_length=100, blank=True, default='TBD')
    status  = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Upcoming')
    notes   = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-time']

    def __str__(self):
        return f"{self.pet.name} — {self.service} on {self.date}"
