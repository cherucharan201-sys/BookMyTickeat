import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

const EMAIL_SERVICE = process.env.EMAIL_SERVICE
const EMAIL_HOST = process.env.EMAIL_HOST
const EMAIL_PORT = Number(process.env.EMAIL_PORT || 587)
const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASS = process.env.EMAIL_PASS
const EMAIL_FROM = process.env.EMAIL_FROM || 'DarshanHome <no-reply@darshanhome.com>'

let transporter

const setupEmailTransport = async () => {
  if (EMAIL_SERVICE && EMAIL_USER && EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: EMAIL_SERVICE,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }
    })
    return
  }

  if (EMAIL_HOST && EMAIL_USER && EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: EMAIL_PORT === 465,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }
    })
    return
  }

  try {
    const testAccount = await nodemailer.createTestAccount()
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    })
    console.log('Ethereal email account created for development: %s', testAccount.user)
    console.log('Preview URL available after sending email')
  } catch (error) {
    console.warn('Email transport could not be configured:', error)
  }
}

const sendBookingConfirmationEmail = async (booking) => {
  if (!transporter) {
    console.warn('No email transporter configured; skipping booking email.')
    return
  }

  const subject = `Darshan Booking Confirmed: ${booking.templeName}`
  const text = `Hello ${booking.name},\n\nYour booking for ${booking.templeName} on ${booking.date} at ${booking.slot} has been confirmed.\n\nPayment status: ${booking.paymentStatus}.\n\nThank you for booking with DarshanHome!\n\nRegards,\nDarshanHome Team`
  const html = `<p>Hello ${booking.name},</p>
<p>Your booking for <strong>${booking.templeName}</strong> on <strong>${booking.date}</strong> at <strong>${booking.slot}</strong> has been confirmed.</p>
<p>Payment status: <strong>${booking.paymentStatus}</strong>.</p>
<p>We look forward to serving you. Thank you for booking with <strong>DarshanHome</strong>!</p>
<p>Regards,<br/>DarshanHome Team</p>`

  const info = await transporter.sendMail({
    from: EMAIL_FROM,
    to: booking.email,
    subject,
    text,
    html
  })

  if (nodemailer.getTestMessageUrl(info)) {
    console.log('Booking confirmation email preview URL:', nodemailer.getTestMessageUrl(info))
  }
}

const sendRegistrationEmail = async (user) => {
  if (!transporter) {
    console.warn('No email transporter configured; skipping registration email.')
    return
  }

  const subject = 'Welcome to DarshanHome'
  const text = `Hello ${user.name},\n\nYour account has been created successfully. You can now book darshan tickets and manage your reservations.`
  const html = `<p>Hello ${user.name},</p>
<p>Your DarshanHome account has been created successfully.</p>
<p>You can now book darshan tickets, manage reminders, and check bookings in real time.</p>
<p>Regards,<br/>DarshanHome Team</p>`

  const info = await transporter.sendMail({
    from: EMAIL_FROM,
    to: user.email,
    subject,
    text,
    html
  })

  if (nodemailer.getTestMessageUrl(info)) {
    console.log('Registration email preview URL:', nodemailer.getTestMessageUrl(info))
  }
}

const sendBookingCancellationEmail = async (booking) => {
  if (!transporter) {
    console.warn('No email transporter configured; skipping cancellation email.')
    return
  }

  const subject = `Darshan Booking Cancelled: ${booking.templeName}`
  const text = `Hello ${booking.name},\n\nYour booking for ${booking.templeName} on ${booking.date} at ${booking.slot} has been cancelled.\n\nIf you need help booking again, please visit DarshanHome.\n\nRegards,\nDarshanHome Team`
  const html = `<p>Hello ${booking.name},</p>
<p>Your booking for <strong>${booking.templeName}</strong> on <strong>${booking.date}</strong> at <strong>${booking.slot}</strong> has been cancelled.</p>
<p>If you need help booking again, please visit <strong>DarshanHome</strong>.</p>
<p>Regards,<br/>DarshanHome Team</p>`

  const info = await transporter.sendMail({
    from: EMAIL_FROM,
    to: booking.email,
    subject,
    text,
    html
  })

  if (nodemailer.getTestMessageUrl(info)) {
    console.log('Booking cancellation email preview URL:', nodemailer.getTestMessageUrl(info))
  }
}

app.use(cors())

// Log incoming requests for debugging route handling
app.use((req, res, next) => {
  console.log('[req]', req.method, req.url)
  next()
})

app.use(express.json())

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/darshan'

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err))

setupEmailTransport().catch((error) => console.error('Email transport setup failed:', error))

const bookingSchema = new mongoose.Schema({
  templeName: String,
  ticketType: { type: String, default: 'Sarva Darshan' },
  amount: { type: Number, default: 300 },
  date: String,
  slot: String,
  name: String,
  email: String,
  reminderEnabled: Boolean,
  reminderDate: String,
  reminderTime: String,
  reminderNote: String,
  paymentMethod: String,
  paymentStatus: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
})

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  createdAt: { type: Date, default: Date.now }
})

const Booking = mongoose.model('Booking', bookingSchema)
const User = mongoose.model('User', userSchema)

const sseClients = []

const broadcastBookings = async () => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 })
    const payload = JSON.stringify({ type: 'bookings', bookings })
    sseClients.forEach((client) => client.write(`data: ${payload}\n\n`))
  } catch (error) {
    console.error('Failed to broadcast bookings:', error)
  }
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' })
})

app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 })
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings' })
  }
})

app.get('/api/bookings/stream', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  })
  res.flushHeaders()
  res.write('retry: 10000\n\n')

  sseClients.push(res)
  req.on('close', () => {
    const index = sseClients.indexOf(res)
    if (index !== -1) {
      sseClients.splice(index, 1)
    }
  })
})

app.post('/api/bookings', async (req, res) => {
  try {
    const booking = new Booking(req.body)
    if (booking.amount === 0) {
      booking.paymentStatus = 'paid'
    }
    await booking.save()
    await broadcastBookings()

    if (booking.paymentStatus === 'paid') {
      await sendBookingConfirmationEmail(booking)
    }

    res.status(201).json(booking)
  } catch (error) {
    console.error('Booking creation error:', error)
    res.status(500).json({ message: 'Failed to create booking' })
  }
})

app.patch('/api/bookings/:id/payment', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        paymentStatus: req.body.paymentStatus || 'paid',
        paymentMethod: req.body.paymentMethod || 'Razorpay'
      },
      { new: true, returnDocument: 'after' }
    )

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    await broadcastBookings()
    await sendBookingConfirmationEmail(booking)
    res.json(booking)
  } catch (error) {
    console.error('Payment update error:', error)
    res.status(500).json({ message: 'Failed to update payment status' })
  }
})

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' })
    }

    const user = new User({ name, email, password })
    await user.save()
    await sendRegistrationEmail(user)
    res.status(201).json({ id: user._id, name: user.name, email: user.email })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Failed to register user.' })
  }
})

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const user = await User.findOne({ email })
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    res.json({ id: user._id, name: user.name, email: user.email })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Failed to login.' })
  }
})

app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    await Booking.findByIdAndDelete(req.params.id)
    await broadcastBookings()
    await sendBookingCancellationEmail(booking)
    res.json({ message: 'Booking cancelled successfully' })
  } catch (error) {
    console.error('Cancellation error:', error)
    res.status(500).json({ message: 'Failed to cancel booking' })
  }
})

// Debug helper: list registered routes
app.get('/__routes', (req, res) => {
  const routes = []
  if (app._router && app._router.stack) {
    app._router.stack.forEach((middleware) => {
      if (middleware && middleware.route) {
        routes.push({ path: middleware.route.path, methods: middleware.route.methods })
      }
    })
  }
  res.json(routes)
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
