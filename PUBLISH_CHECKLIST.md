# Production Deployment Checklist

## Pre-Deployment Review

### Code Quality
- [ ] Run `npm run lint` - no critical errors
- [ ] Run `npm run build` - builds successfully
- [ ] Test locally with `npm run dev` and `npm run dev:server`
- [ ] All API endpoints tested and working
- [ ] No console errors in browser DevTools
- [ ] No hardcoded credentials or sensitive data in code

### Documentation
- [ ] README.md is up to date
- [ ] DEPLOYMENT.md contains accurate instructions
- [ ] Environment variables documented in .env.example
- [ ] Database schema documented

### Security Checklist
- [ ] All environment variables are using secure values
- [ ] CORS is properly configured for production domain
- [ ] API rate limiting implemented (if needed)
- [ ] Input validation on all API endpoints
- [ ] Authentication tokens are secure (JWT best practices)
- [ ] No debug mode enabled in production
- [ ] MongoDB has IP whitelist configured

### Performance
- [ ] Frontend build size checked (< 150KB gzipped is good)
- [ ] Images optimized
- [ ] Database queries indexed
- [ ] API responses are efficient

## Frontend Deployment (Vercel)

### Setup
- [ ] GitHub repository linked to Vercel
- [ ] Build command set to: `npm run build`
- [ ] Output directory set to: `dist`
- [ ] Node.js version set to: 18

### Environment Variables
- [ ] `VITE_API_URL` set to backend API URL
- [ ] Variables are securely set in Vercel dashboard

### Testing
- [ ] Frontend deploys successfully
- [ ] All pages load correctly
- [ ] No 404 errors for assets
- [ ] Navigation works as expected
- [ ] API calls point to correct backend URL

## Backend Deployment (Railway/Render/Heroku)

### Setup
- [ ] Repository connected to deployment service
- [ ] Build command configured (if required)
- [ ] Start command: `node server.js`

### Environment Variables
- [ ] `MONGODB_URI` - MongoDB connection string
- [ ] `EMAIL_SERVICE` - Email provider (gmail, etc.)
- [ ] `EMAIL_USER` - Email account username
- [ ] `EMAIL_PASS` - Email app password
- [ ] `EMAIL_FROM` - From address for emails
- [ ] `PORT` - Set to service default (usually auto-detected)
- [ ] `NODE_ENV` - Set to `production`

### Testing
- [ ] Server starts without errors
- [ ] MongoDB connection successful
- [ ] All API endpoints respond correctly
- [ ] Email sending works
- [ ] Logs are accessible and readable

## Database (MongoDB Atlas)

### Setup
- [ ] MongoDB cluster created and running
- [ ] Database user created with strong password
- [ ] IP whitelist configured (allow 0.0.0.0/0 for cloud apps, or specific IPs)
- [ ] Connection string obtained and added to backend

### Testing
- [ ] Database connection works
- [ ] Collections created successfully
- [ ] Sample data can be inserted and retrieved
- [ ] Indexes created for performance

## Email Configuration (Gmail)

### Setup
- [ ] Gmail account created/selected
- [ ] 2-Factor Authentication enabled
- [ ] App Password generated (16 characters)
- [ ] App Password added to backend environment

### Testing
- [ ] Test registration email sends successfully
- [ ] Email content displays correctly
- [ ] Links in email work properly

## Post-Deployment Verification

### Functional Testing
- [ ] User can register new account
- [ ] User receives welcome email
- [ ] User can login
- [ ] User can browse temples
- [ ] User can book a temple slot
- [ ] User receives booking confirmation email
- [ ] User can view bookings
- [ ] User can cancel booking
- [ ] User can logout

### Performance Testing
- [ ] Page load time < 3 seconds
- [ ] API responses < 500ms
- [ ] No memory leaks
- [ ] Database queries are fast

### Security Testing
- [ ] HTTPS enforced on all pages
- [ ] No sensitive data in browser storage (only encrypted tokens)
- [ ] CORS headers set correctly
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] Session/token expiration working

### Monitoring Setup
- [ ] Error tracking enabled (Sentry, etc.)
- [ ] Application logging configured
- [ ] Performance monitoring set up
- [ ] Uptime monitoring configured
- [ ] Alert notifications configured

## Domain & DNS

- [ ] Custom domain purchased (optional)
- [ ] DNS records configured for Vercel
- [ ] SSL certificate enabled (automatic with Vercel)
- [ ] Domain redirects configured

## Backup & Recovery

- [ ] Database backups configured
- [ ] Backup frequency set (daily recommended)
- [ ] Recovery procedure documented
- [ ] Test database restore process

## Go-Live

- [ ] All checklist items completed
- [ ] Team communication about deployment
- [ ] Support contacts established
- [ ] Monitoring dashboards ready
- [ ] Rollback plan prepared (if issues occur)

### Deployment Command
```bash
# Verify build
npm run build

# Commit changes
git add .
git commit -m "Prepare for production deployment"

# Push to main (triggers automatic Vercel deployment)
git push origin main
```

### After Deployment
1. Test all features on live app
2. Monitor error logs for 24 hours
3. Collect user feedback
4. Be ready to rollback if critical issues found

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Notes**: _______________
