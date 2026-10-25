import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

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
let emailTransportMode = 'unavailable'

const setupEmailTransport = async () => {
  if (EMAIL_SERVICE && EMAIL_USER && EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: EMAIL_SERVICE,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }
    })
    emailTransportMode = 'smtp'
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
    emailTransportMode = 'smtp'
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
    emailTransportMode = 'preview'
    console.log('Ethereal email account created for development: %s', testAccount.user)
    console.log('Preview URL available after sending email')
  } catch (error) {
    console.warn('Email transport could not be configured:', error)
  }
}

const sendLoginNotificationEmail = async (user) => {
  if (!transporter) {
    console.warn('Login succeeded, but no email transporter is configured; login notification was not sent.')
    return { delivered: false, message: 'Login succeeded, but the email alert could not be sent.' }
  }

  const loginTime = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata'
  })
  const text = `Hello ${user.name},\n\nA sign-in to your BookMyTickets account was just completed on ${loginTime} IST.\n\nIf this was not you, reset your password and contact support.\n\nBookMyTickets`
  const html = `<p>Hello ${user.name},</p>
<p>A sign-in to your <strong>BookMyTickets</strong> account was just completed on <strong>${loginTime} IST</strong>.</p>
<p>If this was not you, reset your password and contact support.</p>
<p>BookMyTickets</p>`

  try {
    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to: user.email,
      subject: 'New sign-in to your BookMyTickets account',
      text,
      html
    })

    const previewUrl = nodemailer.getTestMessageUrl(info)
    if (previewUrl) {
      console.log('Login notification preview URL:', previewUrl)
    }

    if (emailTransportMode === 'preview') {
      console.warn('Login notification was generated in test mode and was not delivered to the account email.')
      return { delivered: false, message: 'Login succeeded. Email alerts are in test mode and were not delivered.' }
    }

    return { delivered: true, message: 'A sign-in alert was sent to your registered email.' }
  } catch (error) {
    console.error('Login notification email failed:', error)
    return { delivered: false, message: 'Login succeeded, but the email alert could not be sent.' }
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
  email: { type: String, unique: true, lowercase: true, trim: true },
  phone: { type: String, unique: true, sparse: true, trim: true },
  password: String,
  createdAt: { type: Date, default: Date.now }
})

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  tokenHash: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true, expires: 0 }
})

const movieTicketSchema = new mongoose.Schema({
  ticketCode: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  movieId: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  cinema: { type: String, required: true },
  theaterId: String,
  address: String,
  theaterLat: String,
  theaterLon: String,
  location: String,
  seats: { type: [String], required: true },
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
})

const Booking = mongoose.model('Booking', bookingSchema)
const User = mongoose.model('User', userSchema)
const Session = mongoose.model('Session', sessionSchema)
const MovieTicket = mongoose.model('MovieTicket', movieTicketSchema)

const normalizePhone = (value) => {
  const phone = String(value || '').trim()
  if (!/^\+?[\d\s().-]+$/.test(phone)) return null

  const digits = phone.replace(/\D/g, '')
  return digits.length >= 7 && digits.length <= 15 ? digits : null
}

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const scrypt = promisify(scryptCallback)

const hashToken = (token) => createHash('sha256').update(token).digest('hex')

const createSession = async (userId) => {
  const token = randomBytes(32).toString('hex')
  await Session.create({
    userId,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  })
  return token
}

const requireAuth = async (req, res, next) => {
  try {
    const authorization = req.get('authorization') || ''
    const [scheme, token] = authorization.split(' ')
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Log in to access your movie tickets.' })
    }

    const session = await Session.findOne({
      tokenHash: hashToken(token),
      expiresAt: { $gt: new Date() }
    })
    if (!session) {
      return res.status(401).json({ message: 'Your session has expired. Please log in again.' })
    }

    req.userId = session.userId
    req.sessionId = session._id
    next()
  } catch (error) {
    console.error('Authentication error:', error)
    res.status(500).json({ message: 'Could not verify your session.' })
  }
}

const hashPassword = async (password) => {
  const salt = randomBytes(16).toString('hex')
  const hash = await scrypt(password, salt, 64)
  return `scrypt$${salt}$${hash.toString('hex')}`
}

const verifyPassword = async (password, storedPassword) => {
  if (typeof storedPassword !== 'string') {
    return { valid: false, needsUpgrade: false }
  }

  if (!storedPassword.startsWith('scrypt$')) {
    return { valid: password === storedPassword, needsUpgrade: true }
  }

  const [, salt, storedHash] = storedPassword.split('$')
  if (!salt || !/^[a-f\d]{128}$/i.test(storedHash || '')) {
    return { valid: false, needsUpgrade: false }
  }

  const hash = await scrypt(password, salt, 64)
  return {
    valid: timingSafeEqual(hash, Buffer.from(storedHash, 'hex')),
    needsUpgrade: false
  }
}

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
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : ''
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : ''
    const phone = normalizePhone(req.body.phone)
    const password = typeof req.body.password === 'string' ? req.body.password : ''

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Name, valid email, phone number, and password are required.' })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Enter a valid email address.' })
    }

    const existingUser = await User.findOne({
      $or: [{ email: { $regex: new RegExp(`^${escapeRegex(email)}$`, 'i') } }, { phone }]
    })
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email or phone number already exists.' })
    }

    const user = new User({ name, email, phone, password: await hashPassword(password) })
    await user.save()
    await sendRegistrationEmail(user)
    const token = await createSession(user._id)
    res.status(201).json({ id: user._id, name: user.name, email: user.email, phone: user.phone, token })
  } catch (error) {
    console.error('Registration error:', error)
    if (error.code === 11000) {
      return res.status(409).json({ message: 'An account with this email or phone number already exists.' })
    }
    res.status(500).json({ message: 'Failed to register user.' })
  }
})

app.post('/api/login', async (req, res) => {
  try {
    const identifier = typeof req.body.identifier === 'string'
      ? req.body.identifier.trim()
      : typeof req.body.email === 'string'
        ? req.body.email.trim()
        : typeof req.body.phone === 'string'
          ? req.body.phone.trim()
          : ''
    const password = typeof req.body.password === 'string' ? req.body.password : ''

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Email or phone number and password are required.' })
    }

    const isEmail = identifier.includes('@')
    const normalizedPhone = isEmail ? null : normalizePhone(identifier)
    if (!isEmail && !normalizedPhone) {
      return res.status(400).json({ message: 'Enter a valid email address or phone number.' })
    }

    const user = await User.findOne(isEmail
      ? { email: { $regex: new RegExp(`^${escapeRegex(identifier)}$`, 'i') } }
      : { phone: normalizedPhone })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email/phone number or password.' })
    }

    const passwordCheck = await verifyPassword(password, user.password)
    if (!passwordCheck.valid) {
      return res.status(401).json({ message: 'Invalid email/phone number or password.' })
    }

    if (passwordCheck.needsUpgrade) {
      user.password = await hashPassword(password)
      await user.save()
    }

    const [token, notification] = await Promise.all([
      createSession(user._id),
      sendLoginNotificationEmail(user)
    ])
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token,
      notification
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Failed to login.' })
  }
})

app.post('/api/logout', requireAuth, async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.sessionId)
    res.json({ message: 'Logged out.' })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({ message: 'Failed to log out.' })
  }
})

app.get('/api/movie-tickets', requireAuth, async (req, res) => {
  try {
    const tickets = await MovieTicket.find({ userId: req.userId }).sort({ createdAt: -1 }).lean()
    res.json(tickets.map(({ _id, __v, userId: _userId, ...ticket }) => ({ ...ticket, id: ticket.ticketCode })))
  } catch (error) {
    console.error('Movie ticket query error:', error)
    res.status(500).json({ message: 'Could not load your saved movie tickets.' })
  }
})

app.post('/api/movie-tickets', requireAuth, async (req, res) => {
  try {
    const { movieId, title, image, date, time, cinema } = req.body
    const seats = req.body.seats
    const validSeats = Array.isArray(seats) &&
      seats.length > 0 &&
      seats.length <= 64 &&
      seats.every((seat) => typeof seat === 'string' && /^[A-H][1-8]$/.test(seat)) &&
      new Set(seats).size === seats.length

    if (
      typeof movieId !== 'string' || !movieId.trim() ||
      typeof title !== 'string' || !title.trim() ||
      typeof image !== 'string' || !/^https:\/\/\S+$/.test(image) ||
      typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      typeof time !== 'string' || !time.trim() ||
      typeof cinema !== 'string' || !cinema.trim() ||
      !validSeats
    ) {
      return res.status(400).json({ message: 'Movie, show, and valid seat details are required.' })
    }

    const reservedSeats = new Set(['A5', 'B4', 'B5', 'C2', 'D7', 'E3', 'F6', 'G1', 'H8'])
    if (seats.some((seat) => reservedSeats.has(seat))) {
      return res.status(400).json({ message: 'One or more selected seats are unavailable in this demo seat map.' })
    }

    const total = seats.reduce((sum, seat) => {
      const row = seat[0]
      return sum + (row <= 'C' ? 180 : row <= 'E' ? 220 : 260)
    }, 0)

    const ticket = await MovieTicket.create({
      ticketCode: `BMT-${randomBytes(6).toString('hex').toUpperCase()}`,
      userId: req.userId,
      movieId: movieId.trim(),
      title: title.trim(),
      image,
      date,
      time: time.trim(),
      cinema: cinema.trim(),
      theaterId: typeof req.body.theaterId === 'string' ? req.body.theaterId : '',
      address: typeof req.body.address === 'string' ? req.body.address : '',
      theaterLat: typeof req.body.theaterLat === 'string' ? req.body.theaterLat : '',
      theaterLon: typeof req.body.theaterLon === 'string' ? req.body.theaterLon : '',
      location: typeof req.body.location === 'string' ? req.body.location : '',
      seats,
      total
    })

    const { _id, __v, userId: _userId, ticketCode, ...details } = ticket.toObject()
    res.status(201).json({ ...details, id: ticketCode })
  } catch (error) {
    console.error('Movie ticket save error:', error)
    res.status(500).json({ message: 'Could not save your movie ticket to the database.' })
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
