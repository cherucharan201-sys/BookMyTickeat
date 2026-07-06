# DarshanHome - Deployment Guide

## Project Overview
This is a full-stack application with:
- **Frontend**: React + Vite (deployed to Vercel)
- **Backend**: Express + Node.js (deployed separately)
- **Database**: MongoDB Atlas
- **Email**: Nodemailer

## Deployment Steps

### Step 1: Push to GitHub
```bash
cd c:\Users\cheru\Desktop\Darshan
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### Step 2: Frontend Deployment (Vercel)

#### Option A: Deploy via Vercel CLI
```bash
npm install -g vercel
vercel
```
Follow the prompts to connect your GitHub repository.

#### Option B: Deploy via Vercel Web Dashboard
1. Go to https://vercel.com
2. Sign in or create an account
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables** (required):
     ```
     VITE_API_URL=https://your-backend-api.com
     ```
6. Click "Deploy"

### Step 3: Backend Deployment

#### Option A: Deploy to Railway (Recommended)
1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_FROM=noreply@darshanhome.com
   PORT=3000
   NODE_ENV=production
   ```
6. Railway will auto-detect `server.js` and start the server

#### Option B: Deploy to Render
1. Go to https://render.com
2. Click "New+" → "Web Service"
3. Connect your GitHub repository
4. Configuration:
   - **Name**: darshan-api
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Region**: Choose closest to your users
5. Add environment variables (same as Railway)
6. Click "Create Web Service"

#### Option C: Deploy to Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create darshan-api

# Add MongoDB URI
heroku config:set MONGODB_URI=your_mongodb_connection_string

# Add email variables
heroku config:set EMAIL_SERVICE=gmail
heroku config:set EMAIL_USER=your_email@gmail.com
heroku config:set EMAIL_PASS=your_app_password

# Deploy
git push heroku main
```

### Step 4: MongoDB Setup

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
5. Use this as `MONGODB_URI` in your deployment environment

### Step 5: Email Configuration

If using Gmail:
1. Enable 2-Factor Authentication on your Gmail account
2. Generate App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Copy the 16-character password
3. Use this as `EMAIL_PASS` in your deployment

### Step 6: Update Frontend API URL

After deploying the backend, update the `VITE_API_URL` environment variable in Vercel:
1. Go to your Vercel project
2. Settings → Environment Variables
3. Update `VITE_API_URL` with your backend URL
4. Vercel will automatically redeploy

## Post-Deployment Testing

1. **Test Frontend**: Visit your Vercel domain
2. **Test Registration**: Create a new account
3. **Test Booking**: Book a temple slot
4. **Test Email**: Check confirmation emails

## Environment Variables Summary

### Frontend (.env)
```
VITE_API_URL=https://your-backend-api.com
```

### Backend (.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
EMAIL_SERVICE=gmail
EMAIL_USER=email@gmail.com
EMAIL_PASS=app_password
EMAIL_FROM=noreply@darshanhome.com
PORT=5000
NODE_ENV=production
```

## Troubleshooting

### "Registration service unavailable"
- Verify `VITE_API_URL` is set correctly in Vercel
- Check backend is running and accessible
- Check CORS is enabled in Express

### Email not sending
- Verify `EMAIL_USER` and `EMAIL_PASS` are correct
- Check Gmail App Password (not regular password)
- Verify `EMAIL_SERVICE` is set to "gmail"

### Database connection errors
- Verify `MONGODB_URI` is correct
- Check MongoDB cluster is running
- Verify IP whitelist on MongoDB Atlas (allow all: 0.0.0.0/0)

## Live URLs

After deployment, you'll have:
- **Frontend**: https://your-vercel-project.vercel.app
- **Backend API**: https://your-backend-service.com
- **Database**: MongoDB Atlas cluster

## Useful Commands

```bash
# Check Vercel deployment logs
vercel logs

# Check Railway/Render logs
# Via dashboard or CLI (refer to service documentation)

# Test API endpoint
curl https://your-backend-api.com/api/register

# Check MongoDB connection
mongo "your_mongodb_uri"
```

---

For more help, refer to:
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- MongoDB Atlas: https://docs.atlas.mongodb.com
