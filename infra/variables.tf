variable "project_name" {
  description = "Short project name used for AWS resource names."
  type        = string
}

variable "aws_region" {
  description = "AWS region for regional resources like EC2 and S3."
  type        = string
  default     = "ap-south-1"
}

variable "domain_name" {
  description = "Root domain purchased in Namecheap, for example example.com."
  type        = string
}

variable "frontend_subdomain" {
  description = "Subdomain for the React frontend. Use www for www.example.com or empty string for the root domain."
  type        = string
  default     = "www"
}

variable "backend_subdomain" {
  description = "Subdomain for the Django backend API."
  type        = string
  default     = "api"
}

variable "ec2_instance_type" {
  description = "EC2 instance size for the Django backend."
  type        = string
  default     = "t3.micro"
}

variable "ec2_volume_size" {
  description = "Root EBS volume size in GiB."
  type        = number
  default     = 20
}

variable "ssh_allowed_cidr" {
  description = "CIDR allowed to SSH into the backend EC2 instance. Replace the default with your public IP /32."
  type        = string
  default     = "0.0.0.0/0"
}

variable "key_name" {
  description = "Existing AWS EC2 key pair name. Leave empty to create one from ssh_public_key."
  type        = string
  default     = ""
}

variable "ssh_public_key" {
  description = "Public SSH key content. Used only when key_name is empty."
  type        = string
  default     = ""
}
