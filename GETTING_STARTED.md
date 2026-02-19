# TTS Converter - Getting Started Guide

## 5-Minute Quick Start

### Step 1: Backend Setup (Terminal 1)
```bash
cd backend
python -m venv venv

# Activate venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
python main.py
```

Wait for this message:
```
✅ Models loaded successfully
```

Backend is running at: `http://localhost:8000`

### Step 2: Frontend Setup (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```

Frontend is running at: `http://localhost:5173`

### Step 3: Open Browser
```
http://localhost:5173
```

**That's it! You're ready to use the TTS converter.**

---

## What You Get

### ✨ Beautiful User Interface
- **Text Input Area**: Enter up to 1000 characters
- **Voice Selector**: Choose from available voices
- **Speed Control**: Adjust playback speed (0.5x to 2.0x)
- **Generate Button**: Synthesize speech with one click
- **Waveform Visualization**: See the audio as it plays
- **Playback Controls**: Play, pause, download, share
- **History Panel**: Access past generations
- **Dark/Light Mode**: Toggle theme preference

### ⚡ Powerful Backend
- **FastAPI**: Modern async Python framework
- **SpeechT5 + HiFi-GAN**: High-quality neural TTS
- **GPU Support**: Automatic CUDA detection
- **Caching**: Smart file-based caching
- **Rate Limiting**: Protection against abuse
- **API Documentation**: Interactive Swagger UI at `/docs`

### 🎯 Production Features
- Comprehensive error handling
- Input validation and sanitization
- Health check endpoint
- Cache management
- Structured logging
- Docker containerization
- Nginx reverse proxy ready

---

## File Structure Explained

```
project/
├── backend/
│   ├── main.py           ← FastAPI application
│   ├── tts_engine.py     ← TTS synthesis engine
│   ├── config.py         ← Configuration
│   ├── requirements.txt   ← Python dependencies
│   ├── .env              ← Environment variables
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── components/       ← React components
│   │   ├── services/         ← API client
│   │   ├── App.tsx           ← Main app
│   │   ├── main.tsx          ← Entry point
│   │   └── index.css         ← Global styles
│   ├── index.html
│   ├── package.json          ← NPM dependencies
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── .env
│
├── Dockerfile              ← Multi-stage Docker build
├── docker-compose.yml      ← Docker Compose config
├── nginx.conf              ← Nginx configuration
├── README.md               ← Complete documentation
├── ARCHITECTURE.md         ← Technical architecture
├── quickstart.sh/bat       ← One-command setup
├── deploy.sh               ← Production deployment
├── test_api.py             ← API testing script
├── Makefile                ← Common commands
└── .env.example            ← Example environment file
```

---

## Common Commands

### Using Makefile (Linux/Mac)
```bash
# Show all commands
make help

# Setup everything
make setup

# Start backend
make backend

# Start frontend
make frontend

# Run tests
make test

# Build Docker image
make docker-build

# Start with docker-compose
make docker-dev

# Clean up
make clean
```

### Manual Commands
```bash
# Backend
cd backend && python main.py

# Frontend
cd frontend && npm run dev

# Frontend build for production
cd frontend && npm run build

# Test API
python test_api.py

# Docker
docker build -t tts-converter:latest .
docker-compose up -d
```

---

## API Endpoints Reference

### Get Available Voices
```bash
curl http://localhost:8000/voices
```

### Generate Speech
```bash
curl -X POST http://localhost:8000/synthesize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello world",
    "voice": "default",
    "speed": 1.0,
    "language": "en"
  }' \
  --output speech.wav
```

### Health Check
```bash
curl http://localhost:8000/health
```

### Cache Statistics
```bash
curl http://localhost:8000/cache-stats
```

### Clear Cache
```bash
curl -X POST http://localhost:8000/clear-cache
```

### Interactive API Docs
```
http://localhost:8000/docs
```

---

## Configuration Guide

### Backend .env
```env
# Server
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
ENVIRONMENT=development

# TTS
TTS_MODEL=speecht5_tts
USE_GPU=true
CACHE_ENABLED=true
CACHE_DIR=./audio_cache

# Rate Limiting
RATE_LIMIT=30/minute

# Logging
LOG_LEVEL=INFO
```

### Frontend .env
```env
VITE_API_URL=http://localhost:8000
```

---

## Troubleshooting

### Backend won't start
```bash
# Check Python version
python --version  # Should be 3.11+

# Try with explicit module
python -m uvicorn main:app --reload

# Check if port is in use
# Windows: netstat -ano | findstr :8000
# Mac/Linux: lsof -i :8000
```

### Frontend won't start
```bash
# Check Node version
node --version  # Should be 20+

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try different port
npm run dev -- --port 3000
```

### Models won't download
```bash
# Check internet connection
# Set Hugging Face cache
export HF_HOME=./models

# Pre-download model
python -c "from transformers import AutoModel; AutoModel.from_pretrained('microsoft/speecht5_tts')"
```

### GPU not detected
```bash
# Check CUDA installation
python -c "import torch; print(torch.cuda.is_available())"

# If False, disable GPU
# In backend/.env: USE_GPU=false
```

---

## Next Steps

### Development
1. Explore the API at `http://localhost:8000/docs`
2. Try different voices and speeds
3. Download and share generated audio
4. Check generation history

### Customization
1. Add custom voices in `tts_engine.py`
2. Modify UI colors in `tailwind.config.js`
3. Add new API endpoints in `main.py`
4. Customize models in `tts_engine.py`

### Deployment
1. Build Docker image: `docker build -t tts-converter .`
2. Push to registry: `docker push your-registry/tts-converter`
3. Deploy with docker-compose or Kubernetes
4. Configure Nginx for SSL/TLS
5. Set up monitoring and logging

### Production Checklist
- [ ] Set `ENVIRONMENT=production` in .env
- [ ] Enable SSL/TLS certificates
- [ ] Configure rate limiting appropriately
- [ ] Set up monitoring (health checks)
- [ ] Enable request logging
- [ ] Configure database backups (if needed)
- [ ] Set up auto-scaling (if using K8s)
- [ ] Create monitoring dashboards
- [ ] Document custom configurations

---

## Performance Tips

### Optimize Speed
1. **Use GPU**: Fastest synthesis (2-5 sec)
2. **Enable Caching**: Reuse previous generations
3. **Use CDN**: Serve frontend from edge locations
4. **Compress Audio**: Consider MP3 conversion
5. **Batch Requests**: Generate multiple audio files together

### Optimize Cost
1. **Set appropriate cache TTL**: Balance storage vs generation
2. **Use spot instances**: For non-critical deployments
3. **Auto-scale**: Only pay for what you use
4. **Compress models**: Use quantized versions
5. **Disable GPU**: For low-traffic deployments

### Optimize Reliability
1. **Health checks**: Monitor backend status
2. **Error handling**: Graceful degradation
3. **Fallbacks**: CPU mode if GPU fails
4. **Rate limiting**: Prevent overload
5. **Logging**: Track issues for debugging

---

## Learning Resources

### Backend
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)
- [PyTorch Documentation](https://pytorch.org/docs/)
- [Hugging Face Hub](https://huggingface.co/docs/hub/index)
- [Transformers Library](https://huggingface.co/docs/transformers/)

### Frontend
- [React Docs](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Deployment
- [Docker Docs](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)

---

## Support

### Getting Help
1. Check logs: `docker logs tts-backend`
2. Read troubleshooting section above
3. Check API documentation at `/docs`
4. Review code comments
5. Check ARCHITECTURE.md for technical details

### Reporting Issues
Please include:
- Python version
- Node version
- Operating system
- Error messages
- Steps to reproduce

---

## Tips & Tricks

### Quick Testing
```bash
# Test without opening browser
python test_api.py

# Batch generate audio
for text in "Hello" "World" "Test"; do
  curl -X POST http://localhost:8000/synthesize \
    -H "Content-Type: application/json" \
    -d "{\"text\":\"$text\",\"voice\":\"default\"}" \
    --output "speech_$text.wav"
done
```

### Performance Monitoring
```bash
# Monitor system resource usage
docker stats tts-backend

# Check cache hit ratio
curl http://localhost:8000/cache-stats | jq .

# Monitor API latency
time curl http://localhost:8000/health
```

### Development Setup
```bash
# Auto-reload backend on changes
pip install watchdog[watchmedo]
watchmedo auto-restart -d backend -p '*.py' -- python main.py

# Auto-reload frontend is automatic with Vite
```

---

**Happy TTS Converting! 🎤**

For more details, see:
- [README.md](README.md) - Complete documentation
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical architecture
- [Makefile](Makefile) - Available commands
