# Use the existing default VPC — do not recreate it
data "aws_vpc" "default" {
  default = true
}

# Fetch all default subnets in the default VPC
data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
  filter {
    name   = "defaultForAz"
    values = ["true"]
  }
}

# Convenience: expose individual subnet data for each AZ used by the app
data "aws_subnet" "us_east_1a" {
  vpc_id            = data.aws_vpc.default.id
  availability_zone = "us-east-1a"
  default_for_az    = true
}

data "aws_subnet" "us_east_1b" {
  vpc_id            = data.aws_vpc.default.id
  availability_zone = "us-east-1b"
  default_for_az    = true
}

data "aws_subnet" "us_east_1c" {
  vpc_id            = data.aws_vpc.default.id
  availability_zone = "us-east-1c"
  default_for_az    = true
}

data "aws_subnet" "us_east_1d" {
  vpc_id            = data.aws_vpc.default.id
  availability_zone = "us-east-1d"
  default_for_az    = true
}

data "aws_subnet" "us_east_1e" {
  vpc_id            = data.aws_vpc.default.id
  availability_zone = "us-east-1e"
  default_for_az    = true
}

data "aws_subnet" "us_east_1f" {
  vpc_id            = data.aws_vpc.default.id
  availability_zone = "us-east-1f"
  default_for_az    = true
}
