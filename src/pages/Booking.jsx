import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { FaCheck, FaTicketAlt } from 'react-icons/fa'
import { getLocalDate, movies } from '../data/movies.js'
import { useAuth } from '../context/AuthContext.jsx'
import { saveMovieTicket } from '../services/movieTickets.js'

const rows = 'ABCDEFGH'.split('')
const reservedSeats = new Set(['A5', 'B4', 'B5', 'C2', 'D7', 'E3', 'F6', 'G1', 'H8'])

const seatPrice = (row) => (row <= 'C' ? 180 : row <= 'E' ? 220 : 260)

const formatDate = (date) => new Date(`${date}T12:00:00`).toLocaleDateString('en-IN', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric'
})

const Booking = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const movie = movies.find((item) => item.id === id)
  const date = searchParams.get('date') || getLocalDate()
  const cinema = searchParams.get('cinema') || ''
  const time = searchParams.get('time') || ''
  const theaterId = searchParams.get('theaterId') || ''
  const address = searchParams.get('address') || ''
  const theaterLat = searchParams.get('theaterLat') || ''
  const theaterLon = searchParams.get('theaterLon') || ''
  const location = searchParams.get('location') || ''
  const [selectedSeats, setSelectedSeats] = useState([])
  const [savedTicket, setSavedTicket] = useState(null)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const { token } = useAuth()
  const navigate = useNavigate()
  const locationState = useLocation()

  if (!movie || !cinema || !time) return <Navigate to="/movies" replace />

  const total = selectedSeats.reduce((sum, seat) => sum + seatPrice(seat[0]), 0)

  const toggleSeat = (seat) => {
    setError('')
    setSelectedSeats((current) =>
      current.includes(seat) ? current.filter((item) => item !== seat) : [...current, seat]
    )
  }

  const confirmBooking = async () => {
    if (selectedSeats.length === 0) {
      setError('Choose at least one seat to continue.')
      return
    }

    if (!token) {
      navigate('/login', {
        state: { from: `${locationState.pathname}${locationState.search}` }
      })
      return
    }

    setIsSaving(true)
    setError('')
    try {
      const ticket = await saveMovieTicket({
        movieId: movie.id,
        title: movie.title,
        image: movie.image,
        date,
        time,
        cinema,
        theaterId,
        address,
        theaterLat,
        theaterLon,
        location,
        seats: selectedSeats
      }, token)
      setSavedTicket(ticket)
    } catch (storageError) {
      console.error('Could not save movie ticket to the database:', storageError)
      setError(storageError.message || 'Your ticket could not be saved. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="content-width booking-layout">
      <section className="booking-panel">
        {savedTicket ? (
          <div className="confirmation">
            <div className="confirmation-icon"><FaCheck /></div>
            <h2>Your demo ticket is saved!</h2>
            <p>{savedTicket.title} · {savedTicket.seats.join(', ')}<br />Booking code: <strong>{savedTicket.id}</strong></p>
            <Link className="btn btn-primary" to="/bookings"><FaTicketAlt /> View my tickets</Link>
          </div>
        ) : (
          <>
            <p className="eyebrow">Pick your seats</p>
            <h1>Select seats</h1>
            <p className="booking-subtitle">Tap the seats you want. Prices vary by row.</p>
            <div className="screen" />
            <p className="screen-label">SCREEN THIS WAY</p>
            <div className="seat-legend">
              <span className="legend-item"><span className="seat-swatch" /> Available</span>
              <span className="legend-item"><span className="seat-swatch selected" /> Selected</span>
              <span className="legend-item"><span className="seat-swatch unavailable" /> Unavailable</span>
            </div>
            <div className="seat-map" aria-label="Choose seats">
              {rows.map((row) => (
                <div className="seat-row" key={row} aria-label={`Row ${row}`}>
                  <span className="seat-row-label">{row}</span>
                  {Array.from({ length: 8 }, (_, index) => {
                    const seat = `${row}${index + 1}`
                    const unavailable = reservedSeats.has(seat)
                    const selected = selectedSeats.includes(seat)
                    return (
                      <button
                        type="button"
                        className={`seat${index === 4 ? ' seat-gap' : ''}${unavailable ? ' unavailable' : ''}${selected ? ' selected' : ''}`}
                        aria-label={`Seat ${seat}${unavailable ? ', unavailable' : `, ₹${seatPrice(row)}`}`}
                        aria-pressed={selected}
                        disabled={unavailable}
                        onClick={() => toggleSeat(seat)}
                        key={seat}
                      >
                        {index + 1}
                      </button>
                    )
                  })}
                  <span className="seat-row-label">{row}</span>
                </div>
              ))}
            </div>
            <p className="seat-price-note">Rows A–C ₹180 · Rows D–E ₹220 · Rows F–H ₹260 per seat</p>
            {error && <p className="message-error" role="alert">{error}</p>}
          </>
        )}
      </section>

      <aside className="summary-card">
        <h2>Booking summary</h2>
        <div className="summary-movie">
          <img src={movie.image} alt="" />
          <div>
            <strong>{movie.title}</strong>
            <span>{movie.certificate} · {movie.language}</span>
          </div>
        </div>
        <div className="summary-row"><span>Theater</span><strong>{cinema}</strong></div>
        {address && <div className="summary-row"><span>Address</span><strong>{address}</strong></div>}
        {location && <div className="summary-row"><span>Near</span><strong>{location}</strong></div>}
        <div className="summary-row"><span>Date</span><strong>{formatDate(date)}</strong></div>
        <div className="summary-row"><span>Showtime</span><strong>{time}</strong></div>
        <div className="summary-row"><span>Seats</span><strong>{selectedSeats.length ? selectedSeats.join(', ') : 'Select seats'}</strong></div>
        <div className="summary-row summary-total"><span>Total</span><strong>₹{total}</strong></div>
        {!savedTicket && (
          <button className="btn btn-primary" type="button" onClick={confirmBooking} disabled={isSaving}>
            {isSaving ? 'Saving ticket...' : 'Save demo ticket'}
          </button>
        )}
        <p className="demo-note">Sample seat map and showtime only. This demo saves your ticket to your account database, but does not check theater availability, reserve real seats, or collect payment.</p>
      </aside>
    </main>
  )
}

export default Booking
