import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaTicketAlt } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext.jsx'
import { getMovieTickets } from '../services/movieTickets.js'

const formatDate = (date) => new Date(`${date}T12:00:00`).toLocaleDateString('en-IN', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric'
})

const MyBookings = () => {
  const [tickets, setTickets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const { isAuthenticated, token } = useAuth()
  const { state } = useLocation()
  const loginNotification = state?.loginNotification

  useEffect(() => {
    if (!token) {
      setTickets([])
      setError('')
      setIsLoading(false)
      return
    }

    let isCurrent = true
    setIsLoading(true)
    setTickets([])
    setError('')
    getMovieTickets(token)
      .then((savedTickets) => {
        if (isCurrent) setTickets(savedTickets)
      })
      .catch((loadError) => {
        console.error('Could not load database movie tickets:', loadError)
        if (isCurrent) setError(loadError.message || 'Could not load your tickets.')
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false)
      })

    return () => { isCurrent = false }
  }, [token])

  return (
    <main className="content-width">
      {loginNotification && (
        <p className={`toast ${loginNotification.delivered ? 'success' : 'error'}`} role="status" aria-live="polite">
          {loginNotification.message}
        </p>
      )}
      <header className="page-header">
        <p className="eyebrow">Saved to your account</p>
        <h1>My tickets</h1>
        <p>Your saved demo tickets are available from your account on any device.</p>
      </header>
      {error && <p className="message-error" role="alert">{error}</p>}
      {isLoading ? (
        <p className="location-result" role="status">Loading your tickets...</p>
      ) : !isAuthenticated ? (
        <div className="empty-state" style={{ marginBottom: 64 }}>
          <h2>Log in to view your tickets</h2>
          <p>Your saved tickets are associated with your account.</p>
          <Link className="btn btn-primary" to="/login"><FaTicketAlt /> Log in</Link>
        </div>
      ) : error ? null : tickets.length ? (
        <div className="tickets-list">
          {tickets.map((ticket) => (
            <article className="ticket-card" key={ticket.id}>
              <img src={ticket.image} alt={`${ticket.title} poster`} />
              <div className="ticket-info">
                <h2>{ticket.title}</h2>
                <p>{ticket.cinema}{ticket.address ? ` · ${ticket.address}` : ''}</p>
                <p>{formatDate(ticket.date)} · {ticket.time}</p>
                <p>Seats: {ticket.seats.join(', ')} · ₹{ticket.total}</p>
              </div>
              <div className="ticket-code">
                Saved ticket code
                <strong>{ticket.id || ticket.ticketCode}</strong>
                <span>Not valid for cinema entry</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state" style={{ marginBottom: 64 }}>
          <h2>No tickets yet</h2>
          <p>Save a demo ticket to see it here.</p>
          <Link className="btn btn-primary" to="/movies"><FaTicketAlt /> Browse movies</Link>
        </div>
      )}
    </main>
  )
}

export default MyBookings
