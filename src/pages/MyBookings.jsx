import { useEffect, useState } from 'react'

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

const createCalendarFile = (booking) => {
  const title = `Darshan Booking - ${booking.templeName}`
  const reminderDate = booking.reminderDate || booking.date
  const reminderTime = booking.reminderTime || '09:00'
  const start = `${reminderDate.replace(/-/g, '')}T${reminderTime.replace(':', '')}00`
  const end = `${reminderDate.replace(/-/g, '')}T${String(Number(reminderTime.split(':')[0]) + 1).padStart(2, '0')}${reminderTime.split(':')[1]}00`
  const description = booking.reminderNote || `Darshan booking for ${booking.templeName}`

  const content = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//DarshanHome//Reminder//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
UID:${booking._id || Date.now()}@darshanhome
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')}
DTSTART:${start}
DTEND:${end}
SUMMARY:${title}
DESCRIPTION:${description}
END:VEVENT
END:VCALENDAR`

  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${booking.templeName.replace(/\s+/g, '-') || 'darshan'}-reminder.ics`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const MyBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')

  const markAsPaid = async (bookingId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/payment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: 'paid' })
      })
      const data = await res.json()
      if (res.ok) {
        setBookings((prev) => prev.map((item) => item._id === bookingId ? data : item))
      }
    } catch (error) {
      console.error(error)
    }
  }

  const cancelBooking = async (bookingId) => {
    const confirmed = window.confirm('Are you sure you want to cancel this booking?')
    if (!confirmed) {
      return
    }

    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setBookings((prev) => prev.filter((item) => item._id !== bookingId))
        setMessageType('success')
        setMessage('Booking cancelled successfully.')
      } else {
        setMessageType('error')
        setMessage('Failed to cancel booking.')
      }
    } catch (error) {
      console.error(error)
      setMessageType('error')
      setMessage('Cancellation request failed.')
    }
  }

  useEffect(() => {
    let eventSource

    const fetchBookings = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/bookings')
        const data = await res.json()
        setBookings(data)
      } catch (error) {
        setBookings([])
      } finally {
        setLoading(false)
      }
    }

    const subscribeToBookings = () => {
      eventSource = new EventSource('http://localhost:5000/api/bookings/stream')
      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data)
          if (payload.type === 'bookings') {
            setBookings(payload.bookings)
          }
        } catch (err) {
          console.error('Failed to parse SSE payload', err)
        }
      }
      eventSource.onerror = () => {
        eventSource.close()
      }
    }

    fetchBookings()
    subscribeToBookings()

    return () => {
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [])

  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => setMessage(''), 3000)
    return () => clearTimeout(timer)
  }, [message])

  return (
    <section className="page-card">
      <p className="eyebrow">My Bookings</p>
      <h2>Your upcoming darshans</h2>
      {message && (
        <div className={`toast ${messageType}`}>
          {message}
        </div>
      )}
      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <>
          {message && <p className="booking-item" style={{ marginBottom: 16 }}>{message}</p>}
          <div className="booking-list">
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-item">
                <h3>{booking.templeName}</h3>
                <p>{booking.date} • {booking.slot}</p>
                <p>Booked by {booking.name} ({booking.email})</p>
                <p>Ticket: {booking.ticketType} • Amount: {booking.amount > 0 ? `₹${booking.amount}` : 'Free'}</p>
                <p>Payment: {booking.paymentStatus === 'paid' ? 'Paid and confirmed' : 'Pending payment'}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                  {booking.paymentStatus !== 'paid' && (
                    <button className="btn btn-light" type="button" onClick={() => markAsPaid(booking._id)}>
                      Complete Payment
                    </button>
                  )}
                  <button className="btn btn-danger" type="button" onClick={() => cancelBooking(booking._id)}>
                    Cancel Booking
                  </button>
                </div>
                {booking.reminderEnabled ? (
                  <>
                    <p>Reminder: {booking.reminderDate || booking.date} at {booking.reminderTime || '09:00'}</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                      <button className="btn btn-light" type="button" onClick={() => createCalendarFile(booking)}>
                        Add to Calendar
                      </button>
                      <a
                        className="btn btn-light"
                        href={createGoogleCalendarUrl(booking)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Add to Google Calendar
                      </a>
                    </div>
                  </>
                ) : (
                  <p>Reminder not set</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

export default MyBookings
