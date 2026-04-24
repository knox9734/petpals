variable "aws_region" {
  description = "Primary AWS region"
  type        = string
  default     = "us-east-1"
}

variable "domain_name" {
  description = "Primary domain for the application"
  type        = string
  default     = "bawpets.online"
}

variable "app_name" {
  description = "Application name used for tagging and naming"
  type        = string
  default     = "petpals"
}

variable "ec2_instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "ec2_ami_id" {
  description = "AMI ID for the EC2 instance"
  type        = string
  default     = "ami-0ec10929233384c7f"
}

variable "ec2_key_name" {
  description = "EC2 key pair name"
  type        = string
  default     = "petpals"
}
