resource "aws_iam_user" "pet_hospital_users" {
  name = "pet_hospital_users"
  path = "/"

  tags = {
    Name = "pet_hospital_users"
  }
}

# Access key — output the secret once and store it in a secret manager
resource "aws_iam_access_key" "pet_hospital_users" {
  user = aws_iam_user.pet_hospital_users.name
}

# Least-privilege policy: S3 frontend read/write + CloudFront invalidation
resource "aws_iam_user_policy" "pet_hospital_users" {
  name = "pet-hospital-deploy-policy"
  user = aws_iam_user.pet_hospital_users.name

  policy = data.aws_iam_policy_document.pet_hospital_users.json
}

data "aws_iam_policy_document" "pet_hospital_users" {
  statement {
    sid    = "S3FrontendDeploy"
    effect = "Allow"
    actions = [
      "s3:PutObject",
      "s3:GetObject",
      "s3:DeleteObject",
      "s3:ListBucket",
    ]
    resources = [
      aws_s3_bucket.frontend.arn,
      "${aws_s3_bucket.frontend.arn}/*",
    ]
  }

  statement {
    sid    = "CloudFrontInvalidation"
    effect = "Allow"
    actions = [
      "cloudfront:CreateInvalidation",
      "cloudfront:GetInvalidation",
    ]
    resources = [aws_cloudfront_distribution.frontend.arn]
  }
}
