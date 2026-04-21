output "namecheap_nameservers" {
  description = "Set these as the custom DNS nameservers in Namecheap for your domain."
  value       = aws_route53_zone.primary.name_servers
}

output "frontend_bucket_name" {
  description = "Upload the React build output to this S3 bucket."
  value       = aws_s3_bucket.frontend.bucket
}

output "frontend_url" {
  description = "React frontend URL."
  value       = "https://${local.frontend_fqdn}"
}

output "cloudfront_distribution_id" {
  description = "Use this when invalidating CloudFront after deploying React."
  value       = aws_cloudfront_distribution.frontend.id
}

output "backend_url" {
  description = "Django backend URL."
  value       = "https://${local.backend_fqdn}"
}

output "backend_public_ip" {
  description = "Elastic IP attached to the Django EC2 instance."
  value       = aws_eip.backend.public_ip
}

output "backend_ssh_command" {
  description = "SSH command for the backend instance if a key pair is configured."
  value       = local.ec2_key_name == null ? "No SSH key configured. Set key_name or ssh_public_key." : "ssh -i /path/to/private-key ubuntu@${aws_eip.backend.public_ip}"
}
