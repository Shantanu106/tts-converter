# 🎉 Welcome to Your TTS Converter!

## ⚡ Quick Start (30 seconds)

### Windows Users
```bash
cd "c:\Users\shant\Desktop\day 2"
quickstart.bat
```

### Mac/Linux Users
```bash
cd "c:\Users\shant\Desktop\day 2"
bash quickstart.sh
```

Then open your browser to: **http://localhost:5173**

---

## 📚 Read These First

1. **[GETTING_STARTED.md](GETTING_STARTED.md)** ← Start here!
2. **[README.md](README.md)** - Full documentation
3. **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Overview

---

## 🎯 What You Get

✅ **Beautiful TTS Website**
- Text input with character counter
- Voice selector
- Speed control (0.5x - 2.0x)
- Waveform visualization
- Download & share buttons
- Dark/light mode
- Generation history

✅ **Powerful Backend**
- FastAPI (modern Python)
- SpeechT5 TTS engine
- GPU acceleration
- Audio caching
- Rate limiting
- API documentation

✅ **Production Ready**
- Docker containerization
- Error handling
- Input validation
- Security features
- Full documentation

---

## 🚀 How to Use

### Automatic Setup (Easiest)
```bash
# Windows
quickstart.bat

# Mac/Linux
bash quickstart.sh
```

### Manual Setup
```bash
# Terminal 1: Backend
cd backend
python -m venv venv
# Activate: venv\Scripts\activate (Windows) or source venv/bin/activate (Mac/Linux)
pip install -r requirements.txt
python main.py

# Terminal 2: Frontend (open new terminal)
cd frontend
npm install
npm run dev
```

### Docker
```bash
docker-compose up
```

---

## 📁 Project Structure

```
Your Project/
├── backend/          ← Python API (FastAPI)
├── frontend/         ← React App (Vite + TypeScript)
├── Dockerfile        ← Docker container
├── docker-compose.yml ← Container orchestration
├── README.md         ← Full documentation
├── GETTING_STARTED.md ← Quick start guide
├── ARCHITECTURE.md   ← Technical details
└── [+ 20 more files]
```

---

## 🎤 Try It Out

Once running (http://localhost:5173):

1. **Type some text** - Up to 1000 characters
2. **Pick a voice** - From the dropdown
3. **Set speed** - Slide from 0.5x to 2.0x
4. **Click Generate** - Wait 2-5 seconds (GPU) or 8-20s (CPU)
5. **Listen** - Click play button
6. **Download** - Save as WAV file
7. **Share** - Copy link or share
8. **History** - Check past generations

---

## 🔧 Troubleshooting

### "Backend won't start"
- Make sure Python 3.11+ is installed
- Check if port 8000 is available
- See [GETTING_STARTED.md](GETTING_STARTED.md#troubleshooting)

### "Frontend won't start"  
- Make sure Node.js 20+ is installed
- Try: `cd frontend && npm install && npm run dev`
- See [GETTING_STARTED.md](GETTING_STARTED.md#troubleshooting)

### "Can't connect backend to frontend"
- Check frontend/.env has `VITE_API_URL=http://localhost:8000`
- Make sure backend is running
- Check firewall settings

### "No GPU detected"
- That's okay! It still works on CPU (slower)
- Backend automatically falls back to CPU

---

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| **GETTING_STARTED.md** | Quick start & troubleshooting |
| **README.md** | Complete documentation |
| **ARCHITECTURE.md** | Technical design |
| **PROJECT_SUMMARY.md** | Project overview |
| **INDEX.md** | Documentation index |
| **DELIVERY_COMPLETE.md** | Checklist of everything |

---

## 🎯 Key Features

- 🎤 Text-to-speech synthesis
- 🎚️ Speed control (0.5x-2.0x)
- 📊 Real-time waveform
- 💾 Download as WAV
- 🌙 Dark/light mode
- 📜 Generation history
- ⚡ GPU acceleration
- 🔒 Rate limiting
- 📱 Mobile responsive

---

## 🏗️ Tech Stack

**Backend**: Python + FastAPI + PyTorch + SpeechT5 + HiFi-GAN  
**Frontend**: React + Vite + TypeScript + Tailwind CSS  
**Deployment**: Docker + Docker Compose + Nginx  

---

## 🔗 URLs When Running

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

---

## 📞 Commands Reference

```bash
# Backend
cd backend && python main.py

# Frontend
cd frontend && npm run dev

# Test API
python test_api.py

# Docker
docker-compose up

# Using Makefile
make setup        # Install everything
make backend      # Start backend
make frontend     # Start frontend
make test         # Test API
make clean        # Clean up
```

---

## ✨ What's Included

✅ Full source code (Python + TypeScript)  
✅ All dependencies configured  
✅ Docker setup ready  
✅ 170+ KB of documentation  
✅ Setup scripts (Windows/Mac/Linux)  
✅ API testing script  
✅ Configuration templates  
✅ Development commands  
✅ Production deployment guide  
✅ Architecture documentation  

---

## 🎉 Next Steps

1. **Right Now**
   - Run quickstart script
   - Open http://localhost:5173
   - Try generating some speech!

2. **In 5 Minutes**
   - Read GETTING_STARTED.md
   - Test different voices
   - Download an audio file

3. **Later**
   - Read full documentation
   - Explore the code
   - Deploy to production
   - Customize for your needs

---

## 💡 Pro Tips

- **Fast Setup**: Use `quickstart.bat` or `bash quickstart.sh`
- **See Logs**: Watch terminal output for debugging
- **Try Cache**: Generate same text twice - second will be instant!
- **Check Status**: Visit http://localhost:8000/health
- **API Docs**: Browse http://localhost:8000/docs
- **History**: Check the history panel (bottom right)
- **Dark Mode**: Toggle in top-right corner

---

## 🚀 Ready to Start?

### Windows
```bash
quickstart.bat
```

### Mac/Linux
```bash
bash quickstart.sh
```

### Manual
```bash
# Backend
cd backend && python main.py

# Frontend (new terminal)
cd frontend && npm run dev
```

**Then go to: http://localhost:5173**

---

## 📞 Need Help?

- Check [GETTING_STARTED.md](GETTING_STARTED.md) for troubleshooting
- Read [README.md](README.md) for detailed docs
- See [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
- Browse [INDEX.md](INDEX.md) for documentation index

---

**You're all set! Start the application and enjoy! 🎤✨**

*Questions? See the documentation files above.*
