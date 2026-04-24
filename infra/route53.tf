resource "aws_route53_zone" "primary" {
  name = var.domain_name

  tags = {
    Name = var.domain_name
  }
}

# ── A (alias) record: bawpets.online → CloudFront ────────────────────────────
resource "aws_route53_record" "root_a" {
  zone_id = aws_route53_zone.primary.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.frontend.domain_name
    zone_id                = aws_cloudfront_distribution.frontend.hosted_zone_id
    evaluate_target_health = false
  }
}

# ── AAAA (alias) record: bawpets.online → CloudFront (IPv6) ──────────────────
resource "aws_route53_record" "root_aaaa" {
  zone_id = aws_route53_zone.primary.zone_id
  name    = var.domain_name
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.frontend.domain_name
    zone_id                = aws_cloudfront_distribution.frontend.hosted_zone_id
    evaluate_target_health = false
  }
}

# ── A record: api.bawpets.online → EC2 Elastic IP ────────────────────────────
resource "aws_route53_record" "api_a" {
  zone_id = aws_route53_zone.primary.zone_id
  name    = "api.${var.domain_name}"
  type    = "A"
  ttl     = 300
  records = [aws_eip.petpals.public_ip]
}

# ── The ACM DNS-validation CNAME records are created in acm.tf ───────────────
# (aws_route53_record.cert_validation)
