# Create bucket with unique name
aws s3api create-bucket --bucket danielcruz-001-storage

# Copy file TO S3 bucket
aws s3 cp hello.txt s3://danielcruz-001-storage

# Copy file FROM S3 bucket
aws s3 cp s3://danielcruz-001-storage/hello.txt hello-copied.txt

# Recursively delete all files and then delete the bucket
aws s3 rm s3://danielcruz-001-storage --recursive
aws s3api delete-bucket --bucket danielcruz-001-storage
