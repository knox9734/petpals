<div align="center">

# 🐾 PetPals
### Veterinary Clinic Management System

**A full-stack web application for modern pet clinics.**  
Manage appointments, patients, doctors, billing, and earnings — all in one place.

<br/>

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![MUI](https://img.shields.io/badge/MUI-v7-007FFF?style=flat-square&logo=mui&logoColor=white)](https://mui.com/)
[![Django](https://img.shields.io/badge/Django-6.0-092E20?style=flat-square&logo=django&logoColor=white)](https://djangoproject.com/)
[![DRF](https://img.shields.io/badge/DRF-3.17-red?style=flat-square)](https://www.django-rest-framework.org/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://sqlite.org/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [User Roles](#-user-roles)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Security Notes](#-security-notes)
- [Roadmap](#-roadmap)

---

## 🌟 Overview

**PetPals** is a comprehensive veterinary clinic management system supporting three distinct user roles — **Patients**, **Staff/Admin**, and **Doctors** — each with a purpose-built, role-protected dashboard.

Patients register their pets and book appointments. Staff manage the full clinic workflow: appointments, invoices, doctor accounts, and earnings tracking. Doctors get a personal portal to view assigned cases and income history. Everything is connected through a secure JWT-authenticated REST API.

---

## ✨ Features

### 🐶 For Patients

| Feature | Description |
|---|---|
| **Pet Registration** | Register multiple pets with species, breed, age, and weight |
| **Appointment Booking** | Choose service type, preferred date & time, and your pet |
| **Personal Dashboard** | Overview of all pets, appointments, and upcoming visits |
| **Billing History** | Real invoice amounts, invoice numbers, and payment status per appointment |
| **Health Reminders** | Upcoming vaccination, grooming, and check-up reminders |

### 🏥 For Staff / Admin

| Feature | Description |
|---|---|
| **Appointment Management** | View, filter, and update all clinic appointments across all patients |
| **Status Control** | Change appointment status: Upcoming → Completed / Cancelled |
| **Doctor Assignment** | Assign registered doctors to appointments via a live dropdown |
| **Invoice System** | Create and update invoices per appointment (Pending / Paid / Waived) |
| **Doctor Management** | Create doctor accounts with specialty, phone, and bio |
| **Earnings Tracking** | Record and manage individual doctor earnings, optionally linked to appointments |
| **Overview Stats** | At-a-glance counts for appointments, invoices, and registered doctors |

### 👨‍⚕️ For Doctors

| Feature | Description |
|---|---|
| **Doctor Dashboard** | Dedicated portal showing all assigned patient appointments |
| **Appointment Tabs** | Filter appointments by All / Upcoming / Completed with live counts |
| **Earnings History** | Full income history with amounts and appointment references |
| **Profile Display** | Shows name, specialty, contact info, and aggregate career stats |

### 🔐 Authentication & Security

| Feature | Description |
|---|---|
| **JWT Tokens** | Access + refresh token pair issued on login |
| **Role-Based Routing** | Each role is automatically redirected to their own protected portal |
| **Staff Code Protection** | Staff registration requires a secret `STAFF_REGISTRATION_CODE` |
| **Token Blacklisting** | Refresh tokens are invalidated server-side on logout |

---

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19 | UI library with hooks |
| **Vite** | 7 | Lightning-fast build tool & dev server |
| **Material UI (MUI)** | v7 | Component library & design system |
| **React Router DOM** | v7 | Client-side routing & navigation |
| **Emotion** | 11 | CSS-in-JS styling engine (MUI peer dep) |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| **Django** | 6.0.4 | Web framework |
| **Django REST Framework** | 3.17.1 | REST API layer |
| **djangorestframework-simplejwt** | 5.5.1 | JWT authentication & token blacklist |
| **django-cors-headers** | 4.9.0 | CORS headers for local development |
| **SQLite** | — | Default database (swap for PostgreSQL in production) |

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     FRONTEND  (React)                    │
│                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │   Patient   │  │ Staff Panel  │  │    Doctor      │  │
│  │  Dashboard  │  │              │  │  Dashboard     │  │
│  └──────┬──────┘  └──────┬───────┘  └──────┬─────────┘  │
│         │                │                  │             │
│         └────────────────┴──────────────────┘             │
│                          │  api.js  (fetch wrapper +      │
│                          │          Bearer token inject)  │
└──────────────────────────┼──────────────────────────────-─┘
                           │  HTTP / JSON  (port 8000)
┌──────────────────────────┼───────────────────────────────┐
│                   BACKEND  (Django)                      │
│                          │                               │
│            ┌─────────────▼────────────┐                 │
│            │  Django REST Framework   │                 │
│            │  Views + Serializers     │                 │
│            └─────────────┬────────────┘                 │
│                          │                               │
│            ┌─────────────▼────────────┐                 │
│            │        ORM Models        │                 │
│            │  User · Pet              │                 │
│            │  Doctor · Appointment    │                 │
│            │  Invoice · DoctorEarning │                 │
│            └─────────────┬────────────┘                 │
│                          │                               │
│            ┌─────────────▼────────────┐                 │
│            │       SQLite DB          │                 │
│            └──────────────────────────┘                 │
└──────────────────────────────────────────────────────────┘
```

### Role-Based Redirect Flow

```
POST /auth/login/
       │
       ├── is_staff = true  ──────────→  /staff         (Staff Panel)
       │
       ├── is_doctor = true ──────────→  /doctor        (Doctor Dashboard)
       │
       └── regular user ─────────────→  /dashboard     (Patient Dashboard)
```

---

## 🗄 Database Schema

```
┌──────────────┐         ┌───────────────────┐
│     User     │  1 : 1  │      Doctor       │
│──────────────│◄────────│───────────────────│
│ id           │         │ id                │
│ username     │         │ user_id  (FK)     │
│ email        │         │ specialty         │
│ first_name   │         │ phone             │
│ last_name    │         │ bio               │
│ is_staff     │         │ created_at        │
│ password     │         └────────┬──────────┘
└──────┬───────┘                  │
       │ 1:N                      │ 1:N
       ▼                          ▼
┌──────────────┐         ┌───────────────────┐
│     Pet      │         │  DoctorEarning    │
│──────────────│         │───────────────────│
│ id           │         │ id                │
│ owner  (FK)  │         │ doctor (FK)       │
│ name         │         │ appointment (FK)  │
│ species      │         │ amount            │
│ breed        │         │ date              │
│ age          │         │ notes             │
│ weight       │         └───────────────────┘
└──────┬───────┘
       │ 1:N
       ▼
┌─────────────────────────────────────────┐
│               Appointment               │
│─────────────────────────────────────────│
│ id                                      │
│ user_id           (FK → User)           │
│ pet_id            (FK → Pet)            │
│ doctor_profile_id (FK → Doctor)         │
│ doctor            (CharField, display)  │
│ service           [General Checkup      │
│                    Vaccination          │
│                    Surgery              │
│                    Dental Care          │
│                    Grooming             │
│                    Emergency Care]      │
│ date / time                             │
│ status            [Upcoming             │
│                    Completed            │
│                    Cancelled]           │
│ notes                                   │
└─────────────────┬───────────────────────┘
                  │ 1:1
                  ▼
       ┌──────────────────┐
       │     Invoice      │
       │──────────────────│
       │ id               │
       │ appointment (FK) │
       │ amount           │
       │ status [Pending  │
       │         Paid     │
       │         Waived]  │
       │ notes            │
       └──────────────────┘
```

---

## 📡 API Reference

> **Base URL:** `http://localhost:8000/api`  
> **Protected routes** require the header: `Authorization: Bearer <access_token>`

### 🔐 Authentication

| Method | Endpoint | Protected | Description |
|---|---|---|---|
| `POST` | `/auth/register/` | ❌ | Register a new patient account |
| `POST` | `/auth/login/` | ❌ | Login — returns access + refresh tokens |
| `POST` | `/auth/logout/` | ✅ | Blacklist the refresh token |
| `GET` | `/auth/me/` | ✅ | Get the current logged-in user |
| `POST` | `/auth/token/refresh/` | ❌ | Obtain a new access token |

### 🐾 Pets

| Method | Endpoint | Protected | Description |
|---|---|---|---|
| `GET` | `/pets/` | ✅ | List all pets owned by current user |
| `POST` | `/pets/` | ✅ | Register a new pet |
| `PUT` | `/pets/<id>/` | ✅ | Update pet details |
| `DELETE` | `/pets/<id>/` | ✅ | Remove a pet |

### 📅 Appointments & Dashboard

| Method | Endpoint | Protected | Description |
|---|---|---|---|
| `GET` | `/appointments/` | ✅ | List current user's appointments |
| `POST` | `/appointments/` | ✅ | Book a new appointment |
| `GET` | `/dashboard/` | ✅ | Full patient dashboard data |

### 🏥 Staff Endpoints

| Method | Endpoint | Protected | Description |
|---|---|---|---|
| `GET` | `/staff/appointments/` | ✅ Staff | List every clinic appointment |
| `PUT` | `/staff/appointments/<id>/` | ✅ Staff | Update status, doctor, notes |
| `GET` | `/staff/invoices/` | ✅ Staff | List all invoices |
| `POST` | `/staff/invoices/create/` | ✅ Staff | Create an invoice for an appointment |
| `PUT` | `/staff/invoices/<id>/` | ✅ Staff | Update invoice amount or status |
| `GET` | `/staff/doctors/` | ✅ Staff | List all registered doctors |
| `POST` | `/staff/doctors/create/` | ✅ Staff | Create a new doctor account |
| `GET/PUT/DELETE` | `/staff/doctors/<id>/` | ✅ Staff | View / edit / delete a doctor |
| `GET` | `/staff/earnings/` | ✅ Staff | List all doctor earnings |
| `POST` | `/staff/earnings/` | ✅ Staff | Record a new earning entry |
| `PUT/DELETE` | `/staff/earnings/<id>/` | ✅ Staff | Update or delete an earning |

### 👨‍⚕️ Doctor Endpoint

| Method | Endpoint | Protected | Description |
|---|---|---|---|
| `GET` | `/doctor/dashboard/` | ✅ Doctor | Appointments, earnings, and stats for the logged-in doctor |

---

## 👥 User Roles

### 🐶 Patient (Regular User)
- Self-registers at `/register`
- Owns and manages their own pets
- Books appointments with service type, pet, date & time
- Views personal dashboard: appointment history, pet profiles, real billing amounts, upcoming visit banner

### 🔑 Staff / Admin
- Registers at `/staff/register` using a secret `STAFF_REGISTRATION_CODE`
- Full read/write access to all clinic appointments
- Creates and assigns registered doctors to appointments
- Issues invoices and marks them Paid / Waived
- Creates doctor accounts (doctors cannot self-register)
- Records and manages individual doctor earnings

### 👨‍⚕️ Doctor
- Account is **created by Staff only** — no self-registration
- Logs in via the standard `/login` page
- Automatically redirected to `/doctor` portal
- Read-only view of their personally assigned appointments
- Full earnings history with amounts and linked appointment details

---

## 📁 Project Structure

```
petpals/
│
├── backend/                                  # Django project
│   ├── accounts/
│   │   ├── migrations/
│   │   │   ├── 0001_initial.py               # Pet, Appointment, User
│   │   │   ├── 0002_invoice.py               # Invoice model
│   │   │   └── 0003_doctor_appointment_      # Doctor, DoctorEarning,
│   │   │       doctor_profile_doctorearning.py  doctor_profile FK
│   │   ├── models.py                         # All data models
│   │   ├── serializers.py                    # DRF serializers
│   │   ├── views.py                          # All API view functions
│   │   └── urls.py                           # URL patterns
│   ├── petpals_backend/
│   │   ├── settings.py                       # Django configuration
│   │   └── urls.py                           # Root URL config
│   ├── manage.py
│   └── requirements.txt
│
└── src/                                      # React frontend
    ├── Context/
    │   └── AuthContext.jsx                   # JWT state, login/logout, user context
    ├── Pages/
    │   ├── Home.jsx                          # Public landing page
    │   ├── Login.jsx                         # Login with role-aware redirect
    │   ├── Register.jsx                      # Patient self-registration
    │   ├── StaffRegister.jsx                 # Code-protected staff registration
    │   ├── Dashboard.jsx                     # Patient portal
    │   ├── BookAppointment.jsx               # Appointment booking form
    │   ├── StaffPanel.jsx                    # Full staff management panel
    │   └── DoctorDashboard.jsx               # Doctor's personal portal
    ├── components/
    │   └── AddPetModal.jsx                   # Reusable add/edit pet modal
    ├── api.js                                # Centralised fetch wrapper + all API calls
    └── App.jsx                               # Route definitions + navigation bar
```

---

## 🚀 Getting Started

### Prerequisites

- **Python** 3.10 or later
- **Node.js** 18 or later
- **pip** and **npm**

---

### 1. Clone the Repository

```bash
git clone https://github.com/knox9734/petpals.git
cd petpals
```

---

### 2. Backend Setup

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS / Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# (Optional) Create a Django superuser for /admin
python manage.py createsuperuser

# Start the development server
python manage.py runserver
```

> ✅ API is now live at `http://localhost:8000/api/`

---

### 3. Frontend Setup

```bash
# From the project root
npm install

# Start the Vite dev server
npm run dev
```

> ✅ App is now live at `http://localhost:5173/`

---

### 4. Create a Staff Account

Navigate to `http://localhost:5173/staff/register` and enter the `STAFF_REGISTRATION_CODE` set in your Django settings (see below).

---

## 🔧 Environment Variables

In `backend/petpals_backend/settings.py`, configure these values (or use a `.env` file with `django-environ`):

```python
# Keep this secret in production
SECRET_KEY = 'your-django-secret-key'

# Required to register staff accounts
STAFF_REGISTRATION_CODE = 'your-secret-staff-code'

# Turn off in production
DEBUG = True

# Add your domain in production
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# Allow the React dev server to call the API
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
]
```

The frontend API base URL is set at the top of `src/api.js`:

```js
const BASE_URL = 'http://localhost:8000/api';
```

Change this to your production domain before building.

---

## 🔒 Security Notes

- **JWT blacklisting** — refresh tokens are invalidated on logout via SimpleJWT's token blacklist app.
- **Server-side role checks** — every staff and doctor endpoint re-validates role on the backend. Frontend role guards are UI convenience only.
- **Doctor detection** — uses `hasattr(user, 'doctor_profile')` against the OneToOneField reverse relation — no extra DB column required.
- **Staff code gate** — the `STAFF_REGISTRATION_CODE` must match exactly; a wrong code deletes the newly created user and returns a 400 error.
- **Password hashing** — Django's default PBKDF2-SHA256 with a random salt.
- **Pet ownership** — all pet and appointment queries are scoped to `owner=request.user` / `user=request.user` — users cannot access each other's data.

---

## 🗺 Roadmap

- [ ] Swap SQLite for PostgreSQL for production deployment
- [ ] Email notifications for appointment confirmations and reminders
- [ ] Patient-side appointment rescheduling and cancellation
- [ ] Doctor availability calendar and schedule management
- [ ] PDF invoice generation and download
- [ ] Search, sort, and pagination on all tables
- [ ] Revenue and appointment analytics charts for staff
- [ ] Dark mode support
- [ ] React Native mobile app

---

## 👨‍💻 Author

Built with ❤️ as part of an MSc Software Engineering Project.

---

<div align="center">

**PetPals** &nbsp;·&nbsp; Compassionate care, modern technology

</div>
