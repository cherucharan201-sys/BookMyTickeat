# 🛕 DarshanHome - Online Temple Darshan Booking System

Book your divine visits with ease, safety, and comfort. Reserve temple slots online and enjoy a smooth spiritual journey without standing in long queues.

## ✨ Features

- 🔐 **User Authentication** - Secure registration and login
- 🛕 **Temple Browsing** - Explore sacred destinations
- 📅 **Smart Booking** - Choose preferred dates and time slots
- 💳 **Payment Integration** - Secure payment processing
- 📧 **Email Notifications** - Automatic confirmation emails
- 📱 **Responsive Design** - Works on all devices
- ⚡ **Real-time Updates** - Live booking status with Server-Sent Events

## 🚀 Quick Start

### Local Development (5 minutes)

```bash
# Install dependencies
npm install

# Start backend server (Terminal 1)
npm run dev:server

# Start frontend dev server (Terminal 2)
npm run dev

# Open http://localhost:5173 in your browser
```

### Using Docker (Full Stack)

```bash
# Build and start all services
docker-compose up -d

# Frontend: http://localhost:5173
# Backend:  http://localhost:5000
# Database: MongoDB (internal)

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📦 Project Structure

```
├── src/
│   ├── pages/          # Page components (Home, Register, Login, etc.)
│   ├── components/     # Reusable UI components
│   ├── context/        # React Context for auth state
│   ├── config/         # API configuration
│   └── App.jsx         # Main app component
├── server.js           # Express backend server
├── vite.config.js      # Vite configuration
├── vercel.json         # Vercel deployment config
├── Dockerfile          # Docker image for backend
└── docker-compose.yml  # Multi-container setup
```

## 🛠 Tech Stack

### Frontend
- React 19 + Vite
- React Router for navigation
- Framer Motion for animations
- React Icons for UI icons

### Backend
- Express.js for API
- MongoDB with Mongoose ODM
- Nodemailer for email notifications
- CORS for cross-origin requests

### Deployment
- **Frontend**: Vercel
- **Backend**: Railway / Render / Heroku
- **Database**: MongoDB Atlas
- **Email**: Gmail with App Passwords

## 📚 Documentation

### For Developers
- **Local Setup**: See this README
- **API Documentation**: See [server.js](server.js)
- **Component Structure**: See `src/components/` directory

### For Deployment
- **Quick Start**: See [QUICK_START.md](QUICK_START.md) - Fastest path to go live
- **Detailed Guide**: See [DEPLOYMENT.md](DEPLOYMENT.md) - Complete instructions for all platforms
- **Pre-Publish Checklist**: See [PUBLISH_CHECKLIST.md](PUBLISH_CHECKLIST.md) - Verification steps

## 🚀 Publishing Your App

### Quickest Path (15 minutes)
1. Read [QUICK_START.md](QUICK_START.md)
2. Deploy frontend to Vercel (5 min)
3. Deploy backend to Railway (5 min)
4. Setup MongoDB Atlas (3 min)
5. Configure Gmail for emails (2 min)

### Complete Guide
See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed step-by-step instructions for each platform.

### Pre-Deployment Verification
Use [PUBLISH_CHECKLIST.md](PUBLISH_CHECKLIST.md) to verify everything before going live.

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Frontend
VITE_API_URL=http://localhost:5000

# Backend
MONGODB_URI=mongodb://localhost:27017/darshan
EMAIL_SERVICE=gmail
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@darshanhome.com
PORT=5000
NODE_ENV=development
```

See [.env.example](.env.example) for all options.

## 📋 Available Scripts

```bash
# Development
npm run dev              # Start frontend dev server
npm run dev:server       # Start backend server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run code linter

# Docker
docker-compose up -d     # Start all services
docker-compose down      # Stop all services
docker-compose logs -f   # View logs
```

## 🔐 Security

- Environment variables for sensitive data
- CORS configured for production domains
- Input validation on all API endpoints
- Secure password handling with bcrypt (can be added)
- HTTPS enforced in production

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "Cannot connect to server" | Make sure `npm run dev:server` is running |
| "Registration service unavailable" | Check `VITE_API_URL` environment variable |
| "Email not sending" | Verify Gmail App Password and enable 2FA on Gmail |
| "Database connection error" | Check MongoDB connection string and IP whitelist |

## 📧 Email Configuration

### Using Gmail
1. Enable 2-Factor Authentication on Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use the 16-character password as `EMAIL_PASS`

### Using Other Providers
Modify `server.js` transporter configuration to use your email service.

## 🤝 Contributing

Pull requests are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Support

For issues, questions, or suggestions:
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment help
- Review [QUICK_START.md](QUICK_START.md) for quick setup
- Check existing issues in the repository

## 📞 Contact

- Email: cherucharan201@gmail.com
- Phone: +93 90767012

---

**Ready to go live?** Start with [QUICK_START.md](QUICK_START.md)! 🚀
