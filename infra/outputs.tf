output "ec2_instance_id" {
  description = "ID of the petpals EC2 instance"
  value       = aws_instance.petpals.id
}

output "ec2_public_ip" {
  description = "Elastic IP attached to petpals EC2"
  value       = aws_eip.petpals.public_ip
}

output "ec2_public_dns" {
  description = "Public DNS of the petpals EC2 instance"
  value       = aws_instance.petpals.public_dns
}

output "s3_bucket_name" {
  description = "Frontend S3 bucket name"
  value       = aws_s3_bucket.frontend.bucket
}

output "s3_website_endpoint" {
  description = "S3 static website endpoint"
  value       = aws_s3_bucket_website_configuration.frontend.website_endpoint
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain"
  value       = aws_cloudfront_distribution.frontend.domain_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID (needed for cache invalidations)"
  value       = aws_cloudfront_distribution.frontend.id
}

output "route53_zone_id" {
  description = "Route53 hosted zone ID for bawpets.online"
  value       = aws_route53_zone.primary.zone_id
}

output "route53_name_servers" {
  description = "Name servers to set at your domain registrar"
  value       = aws_route53_zone.primary.name_servers
}

output "acm_certificate_arn" {
  description = "ARN of the ACM certificate for bawpets.online"
  value       = aws_acm_certificate.domain.arn
}

output "iam_user_access_key_id" {
  description = "Access key ID for the deploy user"
  value       = aws_iam_access_key.pet_hospital_users.id
}

output "iam_user_secret_access_key" {
  description = "Secret access key for the deploy user — store securely"
  value       = aws_iam_access_key.pet_hospital_users.secret
  sensitive   = true
}
