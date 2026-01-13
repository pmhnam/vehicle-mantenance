#!/bin/bash

# Default image name
IMAGE_NAME="${DOCKER_IMAGE_NAME:-gadola/vehicle-mantenance-app:latest}"

echo "Building and Pushing Docker Image: $IMAGE_NAME"

# Build the image for linux/amd64 (standard VPS)
# We use --platform linux/amd64 to ensure it runs on Intel/AMD servers even if built on Apple Silicon
docker build --platform linux/amd64 -t "$IMAGE_NAME" .

# Push the image
echo "Pushing image to registry..."
docker push "$IMAGE_NAME"

echo "Done! You can now deploy on VPS using docker-compose.prod.yml"
