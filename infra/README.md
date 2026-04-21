# AWS Terraform Deployment

This Terraform creates infrastructure for:

- React frontend on private S3 behind CloudFront with HTTPS.
- Django backend on EC2 with Docker installed.
- Caddy reverse proxy on EC2 for automatic HTTPS on the API domain.
- Route 53 hosted zone and DNS records for a Namecheap domain.

## 1. Configure Variables

Create your local variable file:

```powershell
Copy-Item terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:

```hcl
project_name       = "myapp"
aws_region         = "ap-south-1"
domain_name        = "yourdomain.com"
frontend_subdomain = "www"
backend_subdomain  = "api"
ssh_allowed_cidr   = "YOUR_PUBLIC_IP/32"
key_name           = "your-existing-aws-keypair"
```

If you do not already have an EC2 key pair, put your public key in `ssh_public_key` instead of `key_name`.

## 2. Deploy Infrastructure

```powershell
terraform init
terraform plan -out tfplan
terraform apply tfplan
```

Terraform will output `namecheap_nameservers`. In Namecheap:

1. Open your domain.
2. Go to `Nameservers`.
3. Choose `Custom DNS`.
4. Add the Route 53 nameservers from the Terraform output.

DNS propagation can take a few minutes, but sometimes takes longer.

## 3. Deploy React To S3

From your React app folder, build the frontend:

```powershell
npm install
npm run build
```

Upload the build output. Use `dist` for Vite or `build` for Create React App.

```powershell
aws s3 sync dist s3://YOUR_FRONTEND_BUCKET --delete
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

Use the Terraform outputs `frontend_bucket_name` and `cloudfront_distribution_id`.

Your frontend will be available at:

```text
https://www.yourdomain.com
```

When `frontend_subdomain = "www"`, this Terraform also points the root domain to the same CloudFront distribution.

## 4. Deploy Django On EC2

SSH into the backend server using the `backend_ssh_command` output:

```powershell
ssh -i path\to\private-key ubuntu@BACKEND_PUBLIC_IP
```

The EC2 instance is prepared with Docker and a Caddy reverse proxy. Run your Django app on host port `8000`; Caddy forwards:

```text
https://api.yourdomain.com -> host port 8000
```

For Django, make sure your production settings include:

```python
DEBUG = False
ALLOWED_HOSTS = ["api.yourdomain.com"]
CSRF_TRUSTED_ORIGINS = ["https://www.yourdomain.com"]
CORS_ALLOWED_ORIGINS = ["https://www.yourdomain.com"]
```

If you use Django REST Framework from React, also install and configure `django-cors-headers`.

## 5. Backend Health Check

Before your Django app is running, this URL should return `ok` over plain HTTP:

```text
http://api.yourdomain.com/_infra-health
```

After DNS points to the EC2 instance, Caddy will request the HTTPS certificate automatically.
