# PetPals / Pet Hospital — AWS Terraform Infrastructure

End-to-end infrastructure-as-code for the **bawpets.online** platform: a Django backend running on EC2 and a React/SPA frontend hosted on S3 + CloudFront, served over a custom domain with a fully automated ACM TLS certificate.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Resource Inventory](#resource-inventory)
3. [Prerequisites](#prerequisites)
4. [Project Structure](#project-structure)
5. [Variables Reference](#variables-reference)
6. [Deployment Guide](#deployment-guide)
7. [Post-Deployment Steps](#post-deployment-steps)
8. [Security Notes](#security-notes)
9. [Outputs Reference](#outputs-reference)
10. [Importing Existing Resources](#importing-existing-resources)
11. [Tear-Down](#tear-down)

---

## Architecture Overview

```
                          ┌─────────────────────────────────────────┐
                          │              Route 53                    │
                          │  bawpets.online  (Hosted Zone)           │
                          │                                           │
                          │  A/AAAA  ──► CloudFront alias            │
                          │  api.   ──► EC2 Elastic IP               │
                          │  _acme-challenge  ──► ACM validation     │
                          └───────────────┬─────────────────────────┘
                                          │
              ┌───────────────────────────┼──────────────────────────────┐
              │                           │                              │
              ▼                           ▼                              │
 ┌────────────────────────┐   ┌───────────────────────┐                 │
 │    CloudFront CDN       │   │  EC2  t3.micro         │                │
 │  d2m8y6tucs45u1.cf.net │   │  "petpals"  us-east-1d │                │
 │  alias: bawpets.online  │   │  Django on :8000       │                │
 │  TLS: TLSv1.2_2021     │   │  Elastic IP attached   │                │
 │  SPA 403/404 → index   │   │  SG: 22,80,443,8000    │                │
 └──────────┬─────────────┘   └───────────────────────┘                │
            │                                                            │
            ▼                                                            │
 ┌────────────────────────┐                                             │
 │   S3  (custom origin)  │                                             │
 │  pet-hospital-frontend  │                                             │
 │  Static website hosting│                                             │
 │  Versioning enabled    │                                             │
 └────────────────────────┘                                             │
                                                                         │
 ┌───────────────────────────────────────────────────────────────────┐  │
 │  ACM Certificate (us-east-1)                                       │◄─┘
 │  bawpets.online + *.bawpets.online                                 │
 │  DNS-validated via Route 53 CNAME records                          │
 └───────────────────────────────────────────────────────────────────┘
```

### Traffic flow

| Path | Route |
|---|---|
| `https://bawpets.online/*` | Browser → CloudFront → S3 website endpoint |
| `https://api.bawpets.online/*` | Browser → EC2 Elastic IP → Gunicorn/Django :8000 |
| SPA deep links (e.g. `/dashboard`) | CloudFront returns 200 + `index.html` (custom error responses) |
| HTTP → HTTPS | CloudFront enforces `redirect-to-https` |

---

## Resource Inventory

### Compute

| Resource | ID / Name | Details |
|---|---|---|
| EC2 Instance | `petpals` | t3.micro, us-east-1d, IMDSv2 enforced |
| AMI | `ami-0ec10929233384c7f` | Linux/UNIX, x86_64 |
| Key Pair | `petpals` | Used for SSH access |
| Elastic IP (app) | attached to EC2 | Static public IP for the backend |
| Elastic IP (spare) | unattached | Reserved for future use |

### Networking

| Resource | ID / CIDR | Notes |
|---|---|---|
| VPC | `vpc-0629ec6f679ab48f1` / `172.31.0.0/16` | Default VPC, managed via `data` source |
| Subnet us-east-1a | `subnet-04cbc19b35f7794e7` / `172.31.0.0/20` | Default, public |
| Subnet us-east-1b | `subnet-00e6ffe658123da01` / `172.31.80.0/20` | Default, public |
| Subnet us-east-1c | `subnet-0876907c03594349c` / `172.31.16.0/20` | Default, public |
| Subnet us-east-1d | `subnet-09f38ca5217944aa3` / `172.31.32.0/20` | Default, public — EC2 lives here |
| Subnet us-east-1e | `subnet-0faa1183a91b3a79c` / `172.31.48.0/20` | Default, public |
| Subnet us-east-1f | `subnet-001b5a12bbe1df401` / `172.31.64.0/20` | Default, public |

### Security Groups

| Name | ID | Inbound Ports |
|---|---|---|
| `launch-wizard-3` | `sg-0c84d3ece0481478a` | 22, 80, 443, 8000 — used by the petpals EC2 |
| `launch-wizard-1` | `sg-021da9cc861c233ce` | 22, 80, 443 |
| `launch-wizard-2` | `sg-00962deb1ad18cf46` | 22, 80, 443, 8000, 3306 |
| `default` | `sg-004bd831ae5ede3dc` | Self-referencing (AWS-managed, not in Terraform) |

### Storage

| Resource | Name | Notes |
|---|---|---|
| S3 Bucket | `pet-hospital-frontend` | Static website, versioning enabled |

### CDN & DNS

| Resource | Value |
|---|---|
| CloudFront Distribution | `E2C1W37PCY0D53` — `d2m8y6tucs45u1.cloudfront.net` |
| CloudFront Alias | `bawpets.online` |
| Cache Policy | Managed CachingOptimized (`658327ea-f89d-4fab-a63d-7e88639e58f6`) |
| Route 53 Zone | `bawpets.online.` — `Z10161541LQCS19GF1LW3` |
| ACM Certificate | `bawpets.online` + `*.bawpets.online` (us-east-1) |

### IAM

| Resource | Name | Purpose |
|---|---|---|
| IAM User | `pet_hospital_users` | CI/CD deploy user |
| User Policy | `pet-hospital-deploy-policy` | S3 + CloudFront invalidation only |

---

## Prerequisites

| Tool | Min Version | Install |
|---|---|---|
| [Terraform](https://developer.hashicorp.com/terraform/downloads) | 1.5.0 | `brew install terraform` / choco / official installer |
| [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) | 2.x | Required for credential setup |
| AWS credentials | — | IAM user or assumed role with sufficient permissions |

### Required IAM permissions for the Terraform operator

The AWS identity running `terraform apply` needs at minimum:

```
ec2:*, s3:*, cloudfront:*, route53:*, acm:*, iam:CreateUser, iam:PutUserPolicy,
iam:CreateAccessKey, iam:DeleteUser, iam:DeleteAccessKey
```

Using an admin role in a dev/sandbox account is the simplest approach.

### AWS credential setup

```bash
# Option A — named profile (recommended)
aws configure --profile petpals
export AWS_PROFILE=petpals

# Option B — environment variables
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
export AWS_DEFAULT_REGION=us-east-1
```

---

## Project Structure

```
terraform/
├── main.tf               # Provider config (aws + aws.us_east_1 alias for ACM)
├── variables.tf          # All input variables with defaults
├── vpc.tf                # Data sources for default VPC and 6 subnets
├── security_groups.tf    # launch-wizard-1, -2, -3 security groups
├── ec2.tf                # EC2 instance + 2 Elastic IPs
├── s3.tf                 # Frontend S3 bucket, website config, bucket policy
├── acm.tf                # ACM certificate + Route 53 DNS validation records
├── cloudfront.tf         # CloudFront distribution
├── route53.tf            # Hosted zone + A/AAAA/api records
├── iam.tf                # Deploy IAM user + access key + policy
├── outputs.tf            # All useful resource attributes
└── README.md             # This file
```

---

## Variables Reference

| Variable | Default | Description |
|---|---|---|
| `aws_region` | `us-east-1` | Primary AWS region |
| `domain_name` | `bawpets.online` | Apex domain — drives CloudFront alias, ACM SAN, Route 53 zone |
| `app_name` | `petpals` | Used for EC2 Name tag and resource name prefixes |
| `ec2_instance_type` | `t3.micro` | Instance type — upgrade to `t3.small` for more headroom |
| `ec2_ami_id` | `ami-0ec10929233384c7f` | Base AMI — update when patching the OS |
| `ec2_key_name` | `petpals` | Must already exist in EC2 Key Pairs before `apply` |

Override any variable at plan time:

```bash
terraform apply -var="ec2_instance_type=t3.small" -var="app_name=mypets"
```

Or create a `terraform.tfvars` file:

```hcl
aws_region        = "us-east-1"
domain_name       = "bawpets.online"
app_name          = "petpals"
ec2_instance_type = "t3.micro"
ec2_ami_id        = "ami-0ec10929233384c7f"
ec2_key_name      = "petpals"
```

---

## Deployment Guide

### Step 1 — Ensure the EC2 key pair exists

The key pair must exist in AWS before Terraform runs (Terraform only references it, never creates the private key).

```bash
# Create a new key pair and save the private key
aws ec2 create-key-pair \
  --key-name petpals \
  --query 'KeyMaterial' \
  --output text > ~/.ssh/petpals.pem
chmod 400 ~/.ssh/petpals.pem
```

If the key pair already exists in AWS, skip this step.

### Step 2 — Initialise Terraform

```bash
cd terraform/
terraform init
```

Expected output includes:

```
Initializing provider plugins...
- Finding hashicorp/aws versions matching "~> 5.0"...
- Installed hashicorp/aws v5.x.x
Terraform has been successfully initialized!
```

### Step 3 — Review the execution plan

```bash
terraform plan -out=tfplan
```

Review the diff carefully. You should see roughly **~20 resources to add** and 0 to destroy on a fresh account.

### Step 4 — Apply

```bash
terraform apply tfplan
```

Type `yes` when prompted. Full apply takes approximately **3–8 minutes**, mostly waiting for:

- ACM certificate DNS validation (~2–5 min)
- CloudFront distribution deployment (~5–8 min after cert issues)

### Step 5 — Update your domain registrar

After apply completes, retrieve the Route 53 name servers:

```bash
terraform output route53_name_servers
```

Go to your domain registrar (Namecheap, GoDaddy, Google Domains, etc.) and replace the default NS records with the four AWS name servers printed by the command above.

> DNS propagation can take up to 48 hours but is usually complete within 15–30 minutes.

---

## Post-Deployment Steps

### Deploy the frontend

Upload your built React/SPA assets and invalidate the CloudFront cache:

```bash
# Build your frontend (example: Vite/React)
npm run build

# Sync to S3
aws s3 sync ./dist s3://pet-hospital-frontend --delete

# Invalidate CloudFront cache so users get the new build immediately
aws cloudfront create-invalidation \
  --distribution-id $(terraform output -raw cloudfront_distribution_id) \
  --paths "/*"
```

### Connect to the EC2 backend

```bash
# SSH using the key pair
ssh -i ~/.ssh/petpals.pem ubuntu@$(terraform output -raw ec2_public_ip)

# Or via Public DNS
ssh -i ~/.ssh/petpals.pem ubuntu@$(terraform output -raw ec2_public_dns)
```

### Retrieve the deploy user credentials

The IAM access key for the `pet_hospital_users` CI/CD user is marked sensitive. Retrieve it once and store it in your CI secret store (GitHub Actions secrets, GitLab CI variables, etc.):

```bash
terraform output iam_user_access_key_id
terraform output -raw iam_user_secret_access_key
```

> **Important:** After storing the secret access key, do not retrieve it again via Terraform output in a shared terminal. The key cannot be recovered from AWS after initial creation — if lost, destroy and re-create it.

### Verify the certificate

```bash
# Check certificate status (should be ISSUED)
aws acm describe-certificate \
  --certificate-arn $(terraform output -raw acm_certificate_arn) \
  --region us-east-1 \
  --query 'Certificate.Status'
```

### Smoke-test the live endpoints

```bash
# Frontend via CloudFront
curl -I https://bawpets.online

# Backend API
curl -I https://api.bawpets.online/api/health/

# Verify redirect: HTTP → HTTPS
curl -I http://bawpets.online
# Expected: 301 Moved Permanently → https://
```

---

## Security Notes

### What is hardened

- **IMDSv2 enforced** on EC2 — `http_tokens = "required"` prevents SSRF attacks that abuse the metadata endpoint.
- **TLSv1.2_2021 minimum** on CloudFront — disables TLS 1.0/1.1 and weak cipher suites.
- **HTTPS redirect** — CloudFront `viewer_protocol_policy = "redirect-to-https"` for all viewers.
- **IAM least privilege** — the deploy user (`pet_hospital_users`) can only put/get/delete S3 objects in the frontend bucket and create CloudFront invalidations. No EC2, RDS, or IAM permissions.
- **S3 block public access** — bucket is not publicly accessible; CloudFront is the only permitted reader via a resource-based bucket policy scoped to the specific distribution ARN.
- **ACM cert covers wildcard** — `*.bawpets.online` so subdomains (api, staging, etc.) can be added without re-issuing.

### What to harden before production

| Issue | Risk | Recommendation |
|---|---|---|
| SSH open to `0.0.0.0/0` (port 22) | Any IP can attempt SSH brute-force | Restrict to your office/VPN CIDR or use AWS Systems Manager Session Manager and remove port 22 entirely |
| MySQL port 3306 open to `0.0.0.0/0` in `launch-wizard-2` | Database exposed to the internet | Restrict to the app security group ID (`sg-0c84d3ece0481478a`) — never open to `0.0.0.0/0` |
| Django port 8000 open to `0.0.0.0/0` | Bypasses Nginx/proxy layer | Restrict to CloudFront IP ranges or a load balancer security group |
| No CloudFront WAF | No protection against SQLi, XSS, rate-limit abuse | Attach an `aws_wafv2_web_acl` resource with AWS Managed Rules |
| No VPC Flow Logs | No visibility into network traffic | Enable `aws_flow_log` on the default VPC |
| No CloudWatch alarms | Silent failures | Add CPU/disk alarms for the EC2 and 5xx alarms for CloudFront |
| No S3 access logging | No audit trail for bucket access | Enable `aws_s3_bucket_logging` pointing to a separate log bucket |

---

## Outputs Reference

After `terraform apply`, the following outputs are available:

```bash
terraform output                        # print all (sensitive values masked)
terraform output -raw <output_name>     # print a single value, unmasked
```

| Output | Description |
|---|---|
| `ec2_instance_id` | EC2 instance ID (`i-…`) |
| `ec2_public_ip` | Elastic IP address attached to the petpals instance |
| `ec2_public_dns` | Public DNS hostname of the EC2 instance |
| `s3_bucket_name` | Name of the frontend S3 bucket |
| `s3_website_endpoint` | S3 static website endpoint URL (used by CloudFront origin) |
| `cloudfront_domain_name` | CloudFront distribution domain (`d2m8….cloudfront.net`) |
| `cloudfront_distribution_id` | CloudFront distribution ID — needed for cache invalidations |
| `route53_zone_id` | Hosted zone ID — needed for external DNS record additions |
| `route53_name_servers` | Four NS values to paste into your domain registrar |
| `acm_certificate_arn` | Full ARN of the issued TLS certificate |
| `iam_user_access_key_id` | Access key ID for the CI/CD deploy user |
| `iam_user_secret_access_key` | **(sensitive)** Secret access key — retrieve once and store securely |

---

## Importing Existing Resources

If the AWS resources were already created manually (as seen in the inventory snapshot dated 2026-04-24), import them into Terraform state before running `apply` to avoid duplicates.

```bash
# Default VPC (data source — no import needed, it uses data.aws_vpc.default)

# EC2 instance
terraform import aws_instance.petpals i-0cadb4076c50eda50

# Elastic IPs
terraform import aws_eip.petpals eipalloc-077baf2110c0a5efb
terraform import aws_eip.spare   eipalloc-0739ad89773ad3f83

# Security groups
terraform import aws_security_group.petpals_app  sg-0c84d3ece0481478a
terraform import aws_security_group.web_basic    sg-021da9cc861c233ce
terraform import aws_security_group.web_db       sg-00962deb1ad18cf46

# S3 bucket
terraform import aws_s3_bucket.frontend pet-hospital-frontend

# CloudFront distribution
terraform import aws_cloudfront_distribution.frontend E2C1W37PCY0D53

# Route 53 hosted zone
terraform import aws_route53_zone.primary Z10161541LQCS19GF1LW3

# ACM certificate (must use us_east_1 provider alias)
terraform import aws_acm_certificate.domain \
  arn:aws:acm:us-east-1:230802933040:certificate/d468ec29-a215-4602-a585-0cf14d949454

# IAM user
terraform import aws_iam_user.pet_hospital_users pet_hospital_users
```

> **Note:** `aws_iam_access_key` cannot be imported — Terraform can only manage keys it creates. If the existing key is still in use, leave it unmanaged or rotate it after importing the user.

After all imports, run `terraform plan` and confirm there are **0 changes** before proceeding.

---

## Tear-Down

```bash
# Preview what will be destroyed — review carefully
terraform plan -destroy

# Destroy all managed resources
terraform destroy
```

> **Warning:** `terraform destroy` will permanently delete the EC2 instance, S3 bucket (including all frontend files), CloudFront distribution, Route 53 zone, and ACM certificate. The domain will stop resolving immediately.
>
> To protect the S3 bucket from accidental deletion, add a `lifecycle { prevent_destroy = true }` block to `aws_s3_bucket.frontend` in [s3.tf](s3.tf).

---

## Account & Region Reference

| Detail | Value |
|---|---|
| AWS Account ID | `230802933040` |
| Primary Region | `us-east-1` |
| ACM Region | `us-east-1` (required for CloudFront) |
| Domain | `bawpets.online` |
| Owner ID | `2a02def240a0a00b74c0c0172d95077283b53eb19bc444c1ea8c0fc770fe1f37` |
