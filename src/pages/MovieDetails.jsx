import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { FaArrowLeft, FaExternalLinkAlt, FaLocationArrow, FaMapMarkerAlt, FaSearch } from 'react-icons/fa'
import { getLocalDate, movies } from '../data/movies.js'
import { findLocation, findNearbyCinemas, getGoogleMapsDirectionsUrl } from '../services/theaters.js'

const getEndOfMonth = () => {
  const today = new Date()
  return getLocalDate(new Date(today.getFullYear(), today.getMonth() + 1, 0))
}

const MovieDetails = () => {
  const { id } = useParams()
  const movie = movies.find((item) => item.id === id)
  const [selectedDate, setSelectedDate] = useState(getLocalDate())
  const [locationQuery, setLocationQuery] = useState('Tirupati, India')
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [nearbyCinemas, setNearbyCinemas] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [locationError, setLocationError] = useState('')
  const requestController = useRef(null)
  useEffect(() => () => requestController.current?.abort(), [])

  if (!movie) return <Navigate to="/movies" replace />

  const searchTheaters = async (location) => {
    requestController.current?.abort()
    const controller = new AbortController()
    requestController.current = controller
    setIsSearching(true)
    setLocationError('')
    setNearbyCinemas([])

    try {
      const venues = await findNearbyCinemas(location, controller.signal)
      setSelectedLocation(location)
      setNearbyCinemas(venues)
      if (venues.length === 0) {
        setLocationError(`No listed cinemas found within 15 km of ${location.label}. Try a nearby city or area.`)
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Nearby cinema search failed:', error)
        setLocationError(error.message || 'Could not find nearby cinemas. Please try again.')
      }
    } finally {
      if (!controller.signal.aborted) setIsSearching(false)
    }
  }

  const handleLocationSearch = async (event) => {
    event.preventDefault()
    const query = locationQuery.trim()
    if (!query) {
      setLocationError('Enter a city or area to find nearby cinemas.')
      return
    }

    requestController.current?.abort()
    const controller = new AbortController()
    requestController.current = controller
    setIsSearching(true)
    setLocationError('')

    try {
      const location = await findLocation(query, controller.signal)
      if (!controller.signal.aborted) await searchTheaters(location)
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Location search failed:', error)
        setLocationError(error.message || 'Could not find that location. Please try again.')
      }
    } finally {
      if (!controller.signal.aborted && requestController.current === controller) setIsSearching(false)
    }
  }

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Location access is not available in this browser. Search by city or area instead.')
      return
    }

    requestController.current?.abort()
    const controller = new AbortController()
    requestController.current = controller
    setIsSearching(true)
    setLocationError('')

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        if (controller.signal.aborted) return
        await searchTheaters({
          lat: coords.latitude,
          lon: coords.longitude,
          label: 'Your current location'
        })
      },
      (error) => {
        if (controller.signal.aborted) return
        setIsSearching(false)
        const message = error.code === error.PERMISSION_DENIED
          ? 'Location permission was denied. Search by city or area instead.'
          : error.code === error.TIMEOUT
            ? 'Could not get your location in time. Please try again or search by city.'
            : 'Could not get your location. Search by city or area instead.'
        setLocationError(message)
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 }
    )
  }

  return (
    <main className="content-width detail-layout">
      <div className="detail-poster-wrap">
        <img className="detail-poster" src={movie.image} alt={`${movie.title} poster`} />
        <a className="poster-source" href={movie.posterSource} target="_blank" rel="noreferrer">
          Poster image source
        </a>
      </div>
      <div className="detail-info">
        <Link to="/movies" className="back-link"><FaArrowLeft /> All movies</Link>
        <p className="eyebrow" style={{ marginTop: 22 }}>{movie.releaseYear} Indian release</p>
        <h1>{movie.title}</h1>
        <div className="detail-meta">
          <span>{movie.certificate}</span>
          <span>{movie.language}</span>
          <span>{movie.industry}</span>
          <span>Released {movie.releaseYear}</span>
          {movie.genres.map((genre) => <span key={genre}>{genre}</span>)}
        </div>
        <p className="detail-description">{movie.description}</p>
        <label className="show-date-label">
          <span className="showtime-heading">Choose a show date</span>
          <input
            className="show-date-input"
            type="date"
            value={selectedDate}
            min={getLocalDate()}
            max={getEndOfMonth()}
            onChange={(event) => setSelectedDate(event.target.value)}
            aria-label="Choose a show date in this month"
          />
          <span className="theater-attribution">October bookings are available for the remaining dates this month.</span>
        </label>
        <aside className="provider-handoff">
          <div>
            <strong>Want to book real tickets?</strong>
            <p>Check live movie, theater, showtime, and seat availability on PVR INOX. Complete your booking and payment there.</p>
          </div>
          <a className="btn btn-primary" href="https://www.pvrcinemas.com/" target="_blank" rel="noreferrer">
            Open PVR INOX <FaExternalLinkAlt />
          </a>
        </aside>
        <h2 className="showtime-heading">Find theaters near you</h2>
        <form className="theater-location-form" onSubmit={handleLocationSearch}>
          <label className="search-field">
            <FaSearch aria-hidden="true" />
            <input
              aria-label="City or area"
              placeholder="Enter your city or area"
              value={locationQuery}
              onChange={(event) => setLocationQuery(event.target.value)}
            />
          </label>
          <button className="btn btn-secondary location-button" type="button" onClick={handleUseMyLocation} disabled={isSearching}>
            <FaLocationArrow /> Use my location
          </button>
          <button className="btn btn-primary location-submit" type="submit" disabled={isSearching}>
            {isSearching ? 'Searching…' : 'Find theaters'}
          </button>
        </form>
        <p className="theater-attribution">
          Nearby venue lookup uses OpenStreetMap and searches within 25 km. Location is not saved by this app.
        </p>
        {selectedLocation && (
          <p className="location-result"><FaMapMarkerAlt /> Showing cinemas near {selectedLocation.label}</p>
        )}
        {locationError && <p className="message-error" role="alert">{locationError}</p>}
        {nearbyCinemas.length > 0 && (
          <>
            <p className="theater-attribution">
              Venue locations from <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>.
              Map listings may include theaters outside PVR INOX. Use PVR INOX to check which venues have live shows for this movie.
            </p>
            {nearbyCinemas.map((cinema) => (
              <section className="cinema-card" key={cinema.id}>
                <div className="cinema-title">
                  <strong>{cinema.name}</strong>
                  <span>{cinema.distanceKm.toFixed(1)} km away · {cinema.address}</span>
                </div>
                <div className="cinema-actions">
                  <a
                    href={getGoogleMapsDirectionsUrl(cinema)}
                    className="map-link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Directions in Google Maps
                  </a>
                </div>
              </section>
            ))}
          </>
        )}
      </div>
    </main>
  )
}

export default MovieDetails
