# Makefile for TTS Converter
# Common development and deployment tasks

.PHONY: help setup backend frontend install test clean docker-build docker-run docker-dev docker-stop docs lint format

help:
	@echo "TTS Converter - Available commands:"
	@echo ""
	@echo "Setup & Installation:"
	@echo "  make setup           - Install all dependencies"
	@echo "  make install         - Install Python and NPM packages"
	@echo ""
	@echo "Development:"
	@echo "  make backend         - Run backend server"
	@echo "  make frontend        - Run frontend dev server"
	@echo "  make dev             - Run both (requires two terminals)"
	@echo ""
	@echo "Testing & Quality:"
	@echo "  make test            - Run API tests"
	@echo "  make lint            - Lint backend code"
	@echo "  make format          - Format code"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-build    - Build Docker image"
	@echo "  make docker-run      - Run production container"
	@echo "  make docker-dev      - Run development with docker-compose"
	@echo "  make docker-stop     - Stop Docker services"
	@echo ""
	@echo "Utilities:"
	@echo "  make clean           - Remove temporary files and caches"
	@echo "  make docs            - Generate API documentation"

setup: install
	@echo "✅ Setup complete!"
	@echo ""
	@echo "To start development:"
	@echo "  Terminal 1: make backend"
	@echo "  Terminal 2: make frontend"

install:
	@echo "📦 Installing Python dependencies..."
	@cd backend && pip install -r requirements.txt
	@echo "✅ Backend dependencies installed"
	@echo ""
	@echo "📦 Installing NPM dependencies..."
	@cd frontend && npm install
	@echo "✅ Frontend dependencies installed"

backend:
	@echo "🚀 Starting backend server..."
	@cd backend && python main.py

frontend:
	@echo "🚀 Starting frontend dev server..."
	@cd frontend && npm run dev

dev:
	@echo "⚠️  This command requires two terminals!"
	@echo "Terminal 1: make backend"
	@echo "Terminal 2: make frontend"

test:
	@echo "🧪 Running API tests..."
	@python test_api.py

lint:
	@echo "🔍 Linting Python code..."
	@cd backend && pylint *.py 2>/dev/null || echo "pylint not installed, skipping"

format:
	@echo "🎨 Formatting code..."
	@cd backend && black *.py 2>/dev/null || echo "black not installed, skipping"
	@cd frontend && npm run lint 2>/dev/null || echo "lint not configured"

docker-build:
	@echo "🐳 Building Docker image..."
	@docker build -t tts-converter:latest .
	@echo "✅ Docker image built"

docker-run:
	@echo "🐳 Running production container..."
	@docker run -p 8000:8000 \
		-v ./models:/app/models \
		-v ./audio_cache:/app/audio_cache \
		tts-converter:latest

docker-dev:
	@echo "🐳 Running development with docker-compose..."
	@docker-compose up

docker-stop:
	@echo "🛑 Stopping Docker containers..."
	@docker-compose down

clean:
	@echo "🧹 Cleaning up..."
	@rm -rf backend/__pycache__
	@rm -rf backend/.pytest_cache
	@rm -rf frontend/node_modules/.vite
	@rm -rf frontend/dist
	@rm -rf temp_audio/*.wav
	@find . -type f -name "*.pyc" -delete
	@find . -type d -name "__pycache__" -delete
	@echo "✅ Cleanup complete"

docs:
	@echo "📚 API Documentation available at:"
	@echo "   http://localhost:8000/docs"
	@echo "   http://localhost:8000/redoc"
