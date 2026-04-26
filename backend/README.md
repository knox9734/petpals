# Django EC2 Deployment Guide
## Connect Django Backend (EC2) to React Frontend (S3 + CloudFront)

---

## Prerequisites

- EC2 instance running Ubuntu (with your Django project uploaded)
- Domain registered on Namecheap, DNS managed by Route53
- Frontend deployed on S3 + CloudFront at `bawpets.online`

---

## Step 1 — Add Subdomain in Route53

1. Go to **AWS Console → Route53 → Hosted Zones → yourdomain.com**
2. Click **Create record**
3. Fill in:
   - Record name: `api`
   - Record type: `A`
   - Value: `<your-ec2-public-ip>`
   - TTL: `300`
4. Save — DNS propagates in ~5 minutes

---

## Step 2 — EC2: Install Dependencies

```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx python3-full -y
```

---

## Step 3 — Set Up Python Virtual Environment

```bash
# Navigate to your Django project
cd /path/to/your/django/project

# Create and activate venv
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install gunicorn
pip install -r requirements.txt
```

---

## Step 4 — Run Gunicorn

```bash
# While venv is active, from inside your project directory
gunicorn your_project_name.wsgi:application --bind 127.0.0.1:8000 --daemon
```

> Replace `your_project_name` with the folder that contains `wsgi.py`

To stop Gunicorn later:
```bash
pkill gunicorn
```

---

## Step 5 — Configure Nginx

Create a new Nginx config file:
```bash
sudo nano /etc/nginx/sites-available/api.yourdomain.com
```

Paste this:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable it:
```bash
sudo ln -s /etc/nginx/sites-available/api.yourdomain.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Step 6 — Free SSL with Certbot

```bash
sudo certbot --nginx -d api.yourdomain.com
```

- Certbot automatically edits Nginx to handle HTTPS
- Auto-renews every 90 days

---

## Step 7 — EC2 Security Group (AWS Console)

Go to **EC2 → Security Groups → your instance's group → Inbound rules**

Ensure these ports are open:

| Port | Protocol | Source    | Purpose           |
|------|----------|-----------|-------------------|
| 22   | TCP      | Your IP   | SSH               |
| 80   | TCP      | 0.0.0.0/0 | HTTP (Certbot)    |
| 443  | TCP      | 0.0.0.0/0 | HTTPS (API)       |

Remove port 8000 from public access if it was open.

---

## Step 8 — Django Settings

In your `settings.py`:

```python
ALLOWED_HOSTS = ['api.yourdomain.com']

CORS_ALLOWED_ORIGINS = [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
]
```

Install CORS headers if not already:
```bash
pip install django-cors-headers
```

In `settings.py`:
```python
INSTALLED_APPS = [
    ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # must be at the top
    ...
]
```

---

## Step 9 — Update Frontend api.js

```js
const BASE_URL = 'https://api.yourdomain.com/api';
```

Redeploy to S3, then invalidate CloudFront cache:
```bash
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

---

## Architecture Overview

```
User Browser
     │
     ▼
CloudFront (HTTPS)
     │
     ▼
S3 (React Frontend)
     │  API calls to api.yourdomain.com
     ▼
Nginx on EC2 (HTTPS :443)
     │
     ▼
Gunicorn (:8000 localhost)
     │
     ▼
Django Application
```

---

## Quick Reference — Useful Commands

```bash
# Restart Nginx
sudo systemctl restart nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Stop/start Gunicorn
pkill gunicorn
source venv/bin/activate && gunicorn your_project.wsgi:application --bind 127.0.0.1:8000 --daemon

# Renew SSL manually
sudo certbot renew

# Check what's running on port 8000
sudo lsof -i :8000
```

---

## Troubleshooting

| Problem | Fix |
|--------|-----|
| `502 Bad Gateway` | Gunicorn is not running — restart it |
| `Mixed Content` error in browser | Frontend is calling HTTP instead of HTTPS — check BASE_URL |
| CORS error | Check `CORS_ALLOWED_ORIGINS` in Django settings |
| `Invalid HTTP_HOST header` | Add subdomain to `ALLOWED_HOSTS` |
| SSL cert fails | Make sure port 80 is open in security group |
