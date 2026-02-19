# ⚡ DEPLOYMENT CHEAT SHEET

## The 4-Minute Deploy Fast Track

### 1. Git Setup (1 min)
```bash
cd "c:\Users\shant\Desktop\day 2"
git init
git add .
git commit -m "Deploy to production"
git remote add origin https://github.com/YOUR_USERNAME/tts-converter
git push -u origin main
```

### 2. GitHub Account (if needed)
- https://github.com/signup
- 2 minutes

### 3. Railway Deploy (1 min)
- https://railway.app
- Login with GitHub
- New Project → Deploy from GitHub
- Select `tts-converter`
- Click "Deploy"

### 4. Configure (2 mins)
Go to Railway backend service → Variables:
```
PYTHONUNBUFFERED=1
TTS_MODEL=speecht5_tts
USE_GPU=false
ENVIRONMENT=production
VITE_API_URL=[copy-your-backend-service-url]
```

### ✅ Done!
Your app is live at: https://your-project.railway.app

---

## Quick Reference: Environment Variables

| Variable | Value | Purpose |
|----------|-------|---------|
| `PYTHONUNBUFFERED` | `1` | Show Python output in real-time |
| `TTS_MODEL` | `speecht5_tts` | Which TTS model to use |
| `USE_GPU` | `false` | Disable GPU (too expensive, CPU works) |
| `ENVIRONMENT` | `production` | Run in production mode |
| `VITE_API_URL` | `backend-url` | Where frontend calls backend |

---

## Troubleshooting Quick Fixes

| Problem | Fix |
|---------|-----|
| Models downloading too slow | Normal - wait 10 mins first run |
| Frontend API errors (404) | Set VITE_API_URL correctly |
| Deploy fails | Check git push succeeded, try again |
| Service crashes | Check logs, usually memory/timeout |
| Can't hear audio | Check speaker volume, browser permissions |

---

## Important URLs (After Deploy)

```
Main app:     https://your-app.railway.app
API docs:     https://your-app.railway.app/docs
Health:       https://your-app.railway.app/health
Voices list:  https://your-app.railway.app/voices
```

---

## File Structure Quick Ref

```
day 2/
├── backend/           ← FastAPI app
│   ├── main.py       
│   ├── tts_engine.py
│   └── config.py
├── frontend/          ← React app
│   ├── src/
│   └── package.json
├── Dockerfile         ← Build instructions
├── docker-compose.yml ← Local dev only
└── nginx.conf         ← Proxy config
```

---

## Updating After Deploy

```bash
# Make your changes
# Commit and push
git add .
git commit -m "Your changes"
git push

# Railway auto-rebuilds in ~2 mins
# Your URL stays the same
# It's that easy!
```

---

## Free Tier Includes

✅ First 512MB memory (more than enough)  
✅ No sleep or timeout  
✅ Auto SSL/HTTPS  
✅ 100GB bandwidth/month  
✅ 10 free builds/month  

**Cost after**: Usually $5/month for light use

---

## Test Commands

```bash
# Check if deployed and healthy
curl https://your-app.railway.app/health

# Get list of voices
curl https://your-app.railway.app/voices

# See all endpoints with docs
# Visit: https://your-app.railway.app/docs
```

---

## Most Important: Don't Panic!

✅ First run = slow (downloading models)  
✅ Models get cached (2nd+ run = fast)  
✅ Check logs when stuck  
✅ Railway has excellent support  
✅ You got this! 🚀

---

**Ready? Go to GO_ONLINE_NOW.md for step-by-step guide!**
