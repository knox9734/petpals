# ACM certificate must live in us-east-1 for CloudFront to use it
resource "aws_acm_certificate" "domain" {
  provider = aws.us_east_1

  domain_name               = var.domain_name
  subject_alternative_names = ["*.${var.domain_name}"]
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name = var.domain_name
  }
}

# Create the DNS validation CNAME records in Route 53
resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.domain.domain_validation_options :
    dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  }

  zone_id = aws_route53_zone.primary.zone_id
  name    = each.value.name
  type    = each.value.type
  records = [each.value.record]
  ttl     = 60

  allow_overwrite = true
}

# Wait for the certificate to be fully issued before CloudFront uses it
resource "aws_acm_certificate_validation" "domain" {
  provider = aws.us_east_1

  certificate_arn         = aws_acm_certificate.domain.arn
  validation_record_fqdns = [for r in aws_route53_record.cert_validation : r.fqdn]
}
