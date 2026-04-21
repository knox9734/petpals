provider "aws" {
  region = var.aws_region
}

# CloudFront requires ACM certificates to be created in us-east-1.
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}
