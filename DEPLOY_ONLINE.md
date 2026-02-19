# 🚀 Deploy Your TTS Converter Online - Complete Guide

## ⚡ Quick Option: Railway.app (Recommended - Easiest)

Railway makes deploying Docker apps online incredibly simple. No credit card needed for the free tier.

### Step 1: Prepare Your Code
```bash
cd "c:\Users\shant\Desktop\day 2"
git init
git add .
git commit -m "Initial commit"
```

If you don't have git, install it from https://git-scm.com/download/win

### Step 2: Create GitHub Repository
1. Go to https://github.com/new
2. Create repository: `tts-converter`
3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/tts-converter.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Railway
1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your `tts-converter` repository
4. Railway auto-detects Docker and deploys!

### Step 4: Configure Environment
In Railway dashboard:
1. Go to your project
2. Click "backend" service
3. Add Variables:
   - `PYTHONUNBUFFERED=1`
   - `TTS_MODEL=speecht5_tts`
   - `USE_GPU=false`
   - `ENVIRONMENT=production`
   - `VITE_API_URL=https://your-railway-url.railway.app`

### Step 5: Add Custom Domain (Optional)
1. In Railway project settings
2. Add your domain (or use free railway.app subdomain)
3. Configure DNS if using custom domain

**Your app is now online!** ✅

---

## 🔧 Alternative Options

### Option 2: Render.com
- **Cost**: Free tier available
- **Setup time**: 10 minutes
- **Advantage**: Very user-friendly

1. Go to https://render.com
2. Push code to GitHub
3. Create new "Web Service" from GitHub repo
4. Build: `docker build -t tts-converter .`
5. Start: `docker-compose up`
6. Render auto-detects and deploys

### Option 3: DigitalOcean
- **Cost**: $5-6/month (app platform) or $4/month (VPS)
- **Setup time**: 20 minutes
- **Advantage**: More control, good for scaling

1. Create DigitalOcean account
2. Enable App Platform
3. Connect GitHub repository
4. Select Dockerfile
5. Deploy!

### Option 4: AWS/Google Cloud/Azure
- **Cost**: Free tier available
- **Setup time**: 30+ minutes
- **Advantage**: Enterprise-grade, most powerful

Use their respective container services (ECS, Cloud Run, Container Instances)

---

## 📋 What Happens During Deployment

When you deploy to any of these platforms:

1. **Docker Build** runs the Dockerfile:
   - Downloads Python 3.11
   - Installs backend dependencies
   - Downloads Node.js 20
   - Builds React frontend
   - Combines everything into one container

2. **Container Starts**:
   - FastAPI backend runs on port 8000
   - Nginx reverse proxy serves frontend + backend on port 80/443
   - Models auto-download on first run (may take 2-3 minutes)

3. **You Get**:
   - Public URL like: `https://tts-converter-abc123.railway.app`
   - SSL/HTTPS automatically enabled
   - Automatic restarts if something fails
   - Access logs and monitoring

---

## 🔐 Security Notes

Before deploying make sure:

1. ✅ No hardcoded secrets in code
2. ✅ Environment variables for sensitive data
3. ✅ CORS configured properly (check `backend/main.py`)
4. ✅ Rate limiting enabled (30 req/min)
5. ✅ Use HTTPS in production

---

## 🆘 Troubleshooting

### "Models fail to download"
- First run takes 5-10 mins to download SpeechT5 and HiFi-GAN
- Check logs: The platform should show progress

### "API 404 errors from frontend"
- Set `VITE_API_URL` environment variable to your deployed backend URL
- Frontend needs to know where backend is running

### "Memory/timeout issues"
- TTS model is ~500MB
- Synthesis takes 2-10 seconds depending on text length
- May need paid tier with more memory

### "SSL certificate errors"
- Most platforms handle this automatically
- If not, contact support or use free Let's Encrypt

---

## 📊 Monitoring After Deploy

### Check Health
```
https://your-url.com/health
```

Response should be:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "models_loaded": true,
  "gpu_available": false,
  "cache_size": "2.3MB"
}
```

### View Logs
- Railway: Dashboard → Logs tab
- Render: Dashboard → Logs
- Check for errors during TTS synthesis

---

## 🎯 Next Steps After Deployment

1. **Share your URL** with friends
2. **Get a custom domain** (optional)
3. **Monitor usage** with analytics
4. **Scale up** if needed (paid plan)
5. **Setup CI/CD** for automatic deployments

---

## 💡 Pro Tips

### Reduce Cold Start Time
- Pre-warm models: Add health check that triggers TTS on startup
- Use GPU if available (but more expensive)

### Optimize Costs
- Use Railway free tier (best value)
- Set memory to minimum needed
- Use spot instances if available

### Setup Auto-Redeploy
- Both Railway and Render auto-deploy when you push to GitHub
- No manual deployment needed!

---

## 🆘 Need Help?

1. Check platform's documentation
2. View deployment logs
3. Ensure Dockerfile runs locally first:
   ```bash
   docker-compose up
   ```
4. Test at `http://localhost:5173`

Happy deploying! 🎉
