# Quick Start: Publishing Your App

This guide provides the fastest path to publishing DarshanHome.

## 📋 What You Need (5 min setup)

1. **GitHub Account** - Free at https://github.com
2. **Vercel Account** - Free at https://vercel.com (sign in with GitHub)
3. **MongoDB Atlas Account** - Free tier at https://mongodb.com/cloud/atlas
4. **Gmail Account** - For email notifications
5. **Railway Account** - Free at https://railway.app (for backend)

## ⚡ Quick Deployment (15 minutes total)

### Step 1: Prepare Your GitHub (Already Done! ✅)
Your code is already in GitHub. No action needed.

### Step 2: Deploy Frontend to Vercel (5 minutes)

```bash
# Option A: Using Vercel Dashboard (Easiest)
# 1. Go to https://vercel.com
# 2. Click "Add New..." → "Project"
# 3. Import your GitHub repository
# 4. Vercel auto-detects React + Vite settings
# 5. Click "Deploy" (wait 2-3 minutes)

# Option B: Using Vercel CLI
npm install -g vercel
vercel --prod
# Follow prompts, select your GitHub repo
```

**Result**: Your frontend is live at `https://your-app.vercel.app`

### Step 3: Setup MongoDB (3 minutes)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free account)
3. Create a **New Project** named "darshan"
4. Create a **New Cluster** (choose "Free" tier)
5. Wait for cluster to spin up (~5 minutes)
6. Click **"Connect"** button:
   - Add current IP (or 0.0.0.0/0 for anywhere)
   - Create database user (save password!)
   - Copy connection string
7. **Replace** `<password>` with your actual password

**Save this connection string** - you'll need it in Step 4.

### Step 4: Deploy Backend to Railway (5 minutes)

1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository
5. Railway auto-detects Node.js
6. Add **Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/darshan
   EMAIL_SERVICE=gmail
   EMAIL_USER=your.email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_FROM=noreply@darshanhome.com
   NODE_ENV=production
   PORT=5000
   ```
7. Click **"Deploy"** (wait 1-2 minutes)

**Get your backend URL**: Click your service → copy the "Public URL"

### Step 5: Configure Email (2 minutes)

Gmail needs "App Password" for security:

1. Go to https://myaccount.google.com/apppasswords
2. Select: Device = "Windows Computer", App = "Mail"
3. Copy the 16-character password
4. Use this as `EMAIL_PASS` in Railway

### Step 6: Link Frontend to Backend (1 minute)

Back in **Vercel Dashboard**:
1. Go to your project
2. Settings → **Environment Variables**
3. Add variable: `VITE_API_URL` = `https://your-railway-backend-url.up.railway.app`
4. Redeploy by going to Deployments → click latest → "Redeploy"

## ✅ Testing Your Live App

1. Visit your Vercel frontend URL
2. **Register** a new account
3. **Check your email** for welcome message
4. **Book a temple**
5. **Check email** for booking confirmation

## 🎯 Success Indicators

- ✅ Frontend loads without 404 errors
- ✅ Registration works, email received
- ✅ Login successful
- ✅ Can book temple slots
- ✅ Booking confirmation email arrives
- ✅ No console errors

## 🚀 Your Live URLs

After deployment, you'll have:

```
Frontend: https://your-app.vercel.app
Backend:  https://your-api.up.railway.app
Database: MongoDB Atlas cloud instance
```

## 📊 Monitoring Your App

### Check Logs
```bash
# Vercel logs (frontend)
vercel logs

# Railway (backend)
# Via dashboard: Click service → Logs tab
```

### Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Registration service unavailable" | Update `VITE_API_URL` in Vercel, redeploy |
| Email not sending | Verify `EMAIL_PASS` is Gmail App Password |
| Database connection error | Check MongoDB connection string and IP whitelist |
| CORS errors | Contact support - backend CORS configured correctly |

## 📚 Additional Resources

- **Deployment Guide**: See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed steps
- **Publish Checklist**: See [PUBLISH_CHECKLIST.md](PUBLISH_CHECKLIST.md) for full verification
- **Local Docker Testing**: See [Docker Setup](#docker-testing) below

## 🐳 Docker Testing (Optional)

Test the full stack locally with Docker before deploying:

```bash
# Requires Docker installed from https://docker.com

# Copy .env.example to .env and fill values
cp .env.example .env

# Start all services (frontend, backend, database)
docker-compose up -d

# Open http://localhost:5173 to test
# View logs: docker-compose logs -f

# Stop everything
docker-compose down
```

---

**That's it! Your app is now live and accessible to the world.** 🎉

**Total time**: ~20 minutes  
**Total cost**: $0 (all free tiers)

For questions or issues, refer to [DEPLOYMENT.md](DEPLOYMENT.md).
