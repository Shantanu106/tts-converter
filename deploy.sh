#!/bin/bash

# Production deployment script for TTS Converter
# This script prepares the application for production deployment

set -e

echo "🚀 TTS Converter - Production Deployment"
echo "======================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed"
    exit 1
fi

echo -e "${GREEN}✓ Docker and docker-compose found${NC}"

# Build Docker image
echo ""
echo -e "${YELLOW}Building production Docker image...${NC}"
docker build -t tts-converter:latest -t tts-converter:$(date +%Y%m%d) .

# Show image info
echo ""
echo -e "${GREEN}✓ Image built successfully${NC}"
docker images | grep tts-converter

# Optional: Start with docker-compose
echo ""
read -p "Start services with docker-compose? (y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Starting services...${NC}"
    docker-compose --profile prod up -d
    
    echo ""
    echo -e "${GREEN}✓ Services running${NC}"
    echo ""
    echo "Check status:"
    echo "  docker-compose ps"
    echo ""
    echo "View logs:"
    echo "  docker-compose logs -f backend"
    echo ""
    echo "Stop services:"
    echo "  docker-compose down"
fi

echo ""
echo -e "${GREEN}Deployment ready!${NC}"
