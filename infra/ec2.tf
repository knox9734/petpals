resource "aws_instance" "petpals" {
  ami                    = var.ec2_ami_id
  instance_type          = var.ec2_instance_type
  key_name               = var.ec2_key_name
  subnet_id              = data.aws_subnet.us_east_1d.id
  vpc_security_group_ids = [aws_security_group.petpals_app.id]

  ebs_optimized = true

  # IMDSv2 enforced (HttpTokens = required, as in the inventory)
  metadata_options {
    http_tokens                 = "required"
    http_put_response_hop_limit = 2
    http_endpoint               = "enabled"
    instance_metadata_tags      = "disabled"
  }

  root_block_device {
    volume_type           = "gp2"
    delete_on_termination = true
  }

  monitoring = false

  tags = {
    Name = var.app_name
  }
}

# Elastic IP attached to the petpals instance
resource "aws_eip" "petpals" {
  instance = aws_instance.petpals.id
  domain   = "vpc"

  tags = {
    Name = "${var.app_name}-eip"
  }
}

# Unattached spare Elastic IP (eipalloc-0739ad89773ad3f83 in the inventory)
resource "aws_eip" "spare" {
  domain = "vpc"

  tags = {
    Name = "${var.app_name}-spare-eip"
  }
}
