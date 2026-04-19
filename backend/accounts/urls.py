from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # Auth
    path('auth/register/',      views.register,      name='register'),
    path('auth/login/',         views.login,         name='login'),
    path('auth/logout/',        views.logout,        name='logout'),
    path('auth/me/',            views.me,            name='me'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Pets
    path('pets/',               views.pets,          name='pets'),
    path('pets/<int:pk>/',      views.pet_detail,    name='pet_detail'),
    # Appointments
    path('appointments/',       views.appointments,  name='appointments'),
    # Dashboard
    path('dashboard/',          views.dashboard,     name='dashboard'),
    # Staff
    path('staff/appointments/',            views.staff_appointments,      name='staff_appointments'),
    path('staff/appointments/<int:pk>/',   views.staff_appointment_detail, name='staff_appointment_detail'),
    path('staff/invoices/',                views.staff_invoices,           name='staff_invoices'),
    path('staff/invoices/create/',         views.staff_invoice_create,     name='staff_invoice_create'),
    path('staff/invoices/<int:pk>/',       views.staff_invoice_detail,     name='staff_invoice_detail'),
]
