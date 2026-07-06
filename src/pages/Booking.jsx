import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import API_URL from '../config/api.js'

const formatDateTimeToGoogle = (date, time) => {
  const [year, month, day] = date.split('-')
  const [hour, minute] = time.split(':')
  const dt = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute)))
  return dt.toISOString().replace(/[-:]|\.000Z/g, '') + 'Z'
}

const createGoogleCalendarUrl = (booking) => {
  const date = booking.reminderDate || booking.date
  const time = booking.reminderTime || '09:00'
  if (!date) return ''

  const start = formatDateTimeToGoogle(date, time)
  const [hour, minute] = time.split(':')
  const endHour = String((Number(hour) + 1) % 24).padStart(2, '0')
  const end = formatDateTimeToGoogle(date, `${endHour}:${minute}`)
  const title = `Darshan Booking - ${booking.templeName}`
  const details = booking.reminderNote || `Darshan booking for ${booking.templeName}`
  const location = booking.templeName

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}&trp=false`
}

const Booking = () => {
  const templeOptions = [
    'Tirumala Temple',
    'Shirdi Sai Baba',
    'Meenakshi Temple',
    'Kedarnath',
    'Vaishno Devi',
    'Golden Temple',
    'Ramanathaswamy Temple',
    'Somnath Temple',
    'Badrinath Temple',
    'Jagannath Temple'
  ]

  const ticketOptions = [
    { label: 'Sarva Darshan', value: 'Sarva Darshan', amount: 300 },
    { label: 'VIP Darshan', value: 'VIP Darshan', amount: 350 },
    { label: 'Free VIP Darshan', value: 'Free VIP Darshan', amount: 0 }
  ]

  const location = useLocation()
  const [formData, setFormData] = useState({
    templeName: templeOptions[0],
    ticketType: ticketOptions[0].value,
    amount: ticketOptions[0].amount,
    date: '',
    slot: 'Morning 6:00 AM',
    name: '',
    email: '',
    reminderEnabled: true,
    reminderDate: '',
    reminderTime: '09:00',
    reminderNote: 'Darshan booking reminder',
    paymentMethod: 'PhonePe'
  })

  const phonePeUri = `upi://pay?pa=darshanhome@okhdfcbank&pn=DarshanHome&am=${formData.amount}&cu=INR&tn=Darshan+Booking`
  const phonePeQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(phonePeUri)}`
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [bookingId, setBookingId] = useState(null)
  const [paymentStatus, setPaymentStatus] = useState('pending')
  const [calendarUrl, setCalendarUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name === 'ticketType') {
      const ticket = ticketOptions.find((option) => option.value === value)
      setFormData({
        ...formData,
        ticketType: value,
        amount: ticket?.amount ?? 0
      })
      return
    }

    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    const payload = {
      ...formData,
      reminderDate: formData.reminderEnabled ? (formData.reminderDate || formData.date) : '',
      reminderTime: formData.reminderEnabled ? formData.reminderTime : '',
      reminderNote: formData.reminderEnabled ? formData.reminderNote : '',
      amount: formData.amount,
      paymentStatus: formData.amount === 0 ? 'paid' : 'pending'
    }

    try {
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (res.ok) {
        setBookingId(data._id)
        setPaymentStatus(data.paymentStatus || 'pending')
        setCalendarUrl(createGoogleCalendarUrl(data))
        setMessageType('success')
        setMessage(`Booking saved successfully! Proceed to ${data.paymentMethod || formData.paymentMethod} to confirm your darshan.`)
        setFormData({
          templeName: templeOptions[0],
          ticketType: ticketOptions[0].value,
          amount: ticketOptions[0].amount,
          date: '',
          slot: 'Morning 6:00 AM',
          name: '',
          email: '',
          reminderEnabled: true,
          reminderDate: '',
          reminderTime: '09:00',
          reminderNote: 'Darshan booking reminder',
          paymentMethod: formData.paymentMethod
        })
      } else {
        setMessageType('error')
        setMessage('Failed to save booking.')
      }
    } catch (error) {
      setMessageType('error')
      setMessage('Server unavailable. Start the backend with npm run dev:server')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePayment = async () => {
    if (!bookingId) return

    try {
      const res = await fetch(`${API_URL}/api/bookings/${bookingId}/payment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: 'paid', paymentMethod: formData.paymentMethod })
      })
      const data = await res.json()
      if (res.ok) {
        setPaymentStatus(data.paymentStatus)
        setMessageType('success')
        setMessage(`Payment of ₹${data.amount} completed via ${data.paymentMethod}. Booking confirmed.`)
      } else {
        setMessageType('error')
        setMessage('Payment could not be completed.')
      }
    } catch (error) {
      setMessageType('error')
      setMessage('Payment service is currently unavailable.')
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const selectedTemple = params.get('temple')
    if (selectedTemple && templeOptions.includes(selectedTemple)) {
      setFormData((prev) => ({ ...prev, templeName: selectedTemple }))
    }
  }, [location.search])

  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => setMessage(''), 3000)
    return () => clearTimeout(timer)
  }, [message])

  useEffect(() => {
    if (!bookingId) return

    const eventSource = new EventSource(`${API_URL}/api/bookings/stream`)

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data)
        if (payload.type !== 'bookings') return

        const booking = payload.bookings.find((item) => item._id === bookingId)
        if (booking) {
          setPaymentStatus(booking.paymentStatus || 'pending')
          if (booking.paymentStatus === 'paid') {
            setMessageType('success')
            setMessage('Payment confirmed in real time! Your booking is now complete.')
          }
        }
      } catch (error) {
        console.error('Realtime booking update error:', error)
      }
    }

    eventSource.onerror = () => {
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [bookingId])

  return (
    <section className="page-card">
      <p className="eyebrow">Darshan Slot Booking</p>
      <h2>Reserve your slot</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <select name="templeName" value={formData.templeName} onChange={handleChange} required>
          {templeOptions.map((temple) => (
            <option key={temple} value={temple}>{temple}</option>
          ))}
        </select>
        <input name="date" value={formData.date} onChange={handleChange} type="date" required />
        <select name="slot" value={formData.slot} onChange={handleChange}>
          <option>Morning 6:00 AM</option>
          <option>Morning 8:00 AM</option>
          <option>Evening 5:00 PM</option>
        </select>
        <select name="ticketType" value={formData.ticketType} onChange={handleChange}>
          {ticketOptions.map((ticket) => (
            <option key={ticket.value} value={ticket.value}>
              {ticket.label} {ticket.amount > 0 ? `(₹${ticket.amount})` : '(Free)'}
            </option>
          ))}
        </select>
        <p style={{ margin: 0, color: '#6b7280' }}>
          Ticket amount: {formData.amount > 0 ? `₹${formData.amount}` : 'Free'}
        </p>
        <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
          <option value="PhonePe">PhonePe</option>
          <option value="Razorpay">Razorpay</option>
          <option value="Cashfree">Cashfree</option>
          <option value="Bank Transfer">Bank Transfer</option>
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input name="reminderEnabled" type="checkbox" checked={formData.reminderEnabled} onChange={handleChange} />
          Add calendar reminder
        </label>
        {formData.reminderEnabled && (
          <>
            <input name="reminderDate" value={formData.reminderDate} onChange={handleChange} type="date" required={formData.reminderEnabled} />
            <input name="reminderTime" value={formData.reminderTime} onChange={handleChange} type="time" required={formData.reminderEnabled} />
            <input name="reminderNote" value={formData.reminderNote} onChange={handleChange} placeholder="Reminder note" />
          </>
        )}
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required />
        <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Email" required />
        <button className="btn btn-dark" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Confirm Booking'}</button>
      </form>
      {bookingId && (
        <div className="booking-item" style={{ marginTop: 12 }}>
          <h3>Payment Gateway</h3>
          <p>Ticket: {formData.ticketType}</p>
          <p>Selected gateway: {formData.paymentMethod}</p>
          <p>Amount: {formData.amount > 0 ? `₹${formData.amount}` : 'Free'}</p>
          <p>Status: {paymentStatus === 'paid' ? 'Paid and confirmed' : 'Pending payment'}</p>
          {formData.amount > 0 && paymentStatus !== 'paid' && (
            <>
              {formData.paymentMethod === 'PhonePe' ? (
                <div className="payment-info">
                  <div className="payment-action">
                    <img
                      src={phonePeQrUrl}
                      alt="PhonePe QR code"
                      className="qr-code"
                    />
                    <div className="payment-instructions">
                      <p className="payment-amount">Pay ₹{formData.amount} via PhonePe</p>
                      <p><strong>Scan this QR in the PhonePe app</strong></p>
                      <p>Use the app to complete the payment, then press Confirm Payment.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="payment-info">
                  <p>Complete your payment using {formData.paymentMethod}. Click below to confirm once your payment succeeds.</p>
                </div>
              )}
              <button className="btn btn-light" type="button" onClick={handlePayment}>
                Pay ₹{formData.amount} via {formData.paymentMethod}
              </button>
            </>
          )}
          {formData.amount === 0 && <p style={{ marginTop: 8 }}>Free booking confirmed automatically.</p>}
          {calendarUrl && (
            <a className="btn btn-light" href={calendarUrl} target="_blank" rel="noreferrer" style={{ marginLeft: 8 }}>
              Add to Google Calendar
            </a>
          )}
        </div>
      )}
      {message && (
        <div className={`toast ${messageType}`} style={{ marginTop: 12 }}>
          {message}
        </div>
      )}
    </section>
  )
}

export default Booking
