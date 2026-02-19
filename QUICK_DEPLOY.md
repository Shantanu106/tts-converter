# 🚀 30-Second Deployment - Railway.app

The easiest way to get your TTS converter online.

## Step 1: Initialize Git (One-time)
```bash
cd "c:\Users\shant\Desktop\day 2"
git init
git add .
git commit -m "Initial TTS converter setup"
```

Need git? Download from: https://git-scm.com/download/win

## Step 2: Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/tts-converter
git branch -M main
git push -u origin main
```

Don't have a GitHub account? Create free one: https://github.com/signup

## Step 3: Deploy on Railway (5 minutes)

1. Go to: https://railway.app/
2. Click **"New Project"**
3. Select **"Deploy from GitHub"**
4. Authorize GitHub access
5. Select your **tts-converter** repository
6. Railway auto-builds Docker image and deploys!
7. Get your public URL in ~2-3 minutes

## Step 4: Set Environment Variables (2 minutes)

In Railway dashboard:

1. Click your **Backend** service
2. Add these environment variables:
   ```
   PYTHONUNBUFFERED=1
   TTS_MODEL=speecht5_tts
   USE_GPU=false
   ENVIRONMENT=production
   ```
3. Click "Backend" service again and note the URL
4. Add new variable:
   ```
   VITE_API_URL=https://[your-service-url]
   ```

## ✅ Done!

Your TTS Converter is now online!

- **Frontend**: https://your-project.railway.app
- **API Health**: https://your-project.railway.app/health
- **API Docs**: https://your-project.railway.app/docs (Swagger)

**First run takes 3-5 minutes** (downloading TTS models - only happens once)

---

## 📊 Check Status

Visit: https://your-project.railway.app/health

Should return:
```json
{
  "status": "healthy",
  "models_loaded": true
}
```

---

## 🔄 Auto-Redeploy

Every time you push to GitHub, Railway automatically rebuilds and deploys!

```bash
git add .
git commit -m "Your change"
git push
# Automatically deploys in ~2 minutes
```

---

## 💰 Free Tier Limits

- **Memory**: 512MB (enough for this app)
- **Uptime**: 100% (no sleep)
- **Bandwidth**: Generous free tier
- **Build time**: 10 free builds/month
- **Billing after**: Only pay for what you use ($5/month is typical)

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Models not downloading | Wait 5 mins on first run, check logs |
| API 404 errors | Make sure VITE_API_URL is set correctly |
| Deploy fails | Push `.gitignore` changes, try again |
| Always rebuilding | Clear Railway build cache |

---

## 🎯 Next Steps

1. ✅ Share your URL with friends
2. ✅ Add custom domain (Settings → Domains)
3. ✅ Setup monitoring (Railway → Metrics)
4. ✅ Scale memory if needed (Pricing → Variable)

---

## 📱 Share Your App

Tweet it! 🐦
```
Just deployed my TTS converter! Try it here: https://your-project.railway.app
#BuildInPublic
```

Enjoy! 🎉
