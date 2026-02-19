#!/bin/bash

# TTS Converter - Quick Start Script
# This script sets up and runs both backend and frontend in development mode

set -e

echo "🚀 TTS Converter - Quick Start"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo ""
echo -e "${YELLOW}Checking prerequisites...${NC}"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Python 3 found${NC}"

# Check Node.js
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ Node.js/npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js found${NC}"

# Setup Backend
echo ""
echo -e "${YELLOW}Setting up backend...${NC}"

cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate 2>/dev/null || . venv/Scripts/activate 2>/dev/null

# Install dependencies
echo "Installing Python dependencies..."
pip install -q -r requirements.txt

# Create necessary directories
mkdir -p models audio_cache temp_audio

echo -e "${GREEN}✓ Backend ready${NC}"

# Setup Frontend
echo ""
echo -e "${YELLOW}Setting up frontend...${NC}"

cd ../frontend

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install -q
fi

echo -e "${GREEN}✓ Frontend ready${NC}"

cd ..

# Print instructions
echo ""
echo -e "${GREEN}======================================"
echo "✅ Setup complete!"
echo "======================================"
echo ""
echo "To start the application:"
echo ""
echo -e "${YELLOW}Terminal 1 (Backend):${NC}"
echo "  cd backend"
echo "  source venv/bin/activate  # or: venv\\Scripts\\activate (Windows)"
echo "  python main.py"
echo ""
echo -e "${YELLOW}Terminal 2 (Frontend):${NC}"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo -e "${GREEN}Then open: http://localhost:5173${NC}"
echo ""
echo "API Docs: http://localhost:8000/docs"
echo ""
