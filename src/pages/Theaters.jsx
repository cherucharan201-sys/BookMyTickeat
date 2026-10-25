import { useEffect, useRef, useState } from 'react'
import { FaExternalLinkAlt, FaLocationArrow, FaMapMarkerAlt, FaSearch } from 'react-icons/fa'
import { findLocation, findNearbyCinemas, getGoogleMapsDirectionsUrl } from '../services/theaters.js'

const DEFAULT_LOCATION = { lat: 13.6288, lon: 79.4192, label: 'Tirupati, Andhra Pradesh, India' }

const Theaters = () => {
  const [query, setQuery] = useState('Tirupati, India')
  const [location, setLocation] = useState(DEFAULT_LOCATION)
  const [theaters, setTheaters] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')
  const abortController = useRef(null)

  useEffect(() => {
    const controller = new AbortController()
    abortController.current = controller
    setIsSearching(true)

    findNearbyCinemas(DEFAULT_LOCATION, controller.signal)
      .then(setTheaters)
      .catch((searchError) => {
        if (searchError.name !== 'AbortError') {
          console.error('Default theater search failed:', searchError)
          setError(searchError.message || 'Could not load theaters for Tirupati.')
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsSearching(false)
      })

    return () => controller.abort()
  }, [])

  const search = async (event) => {
    event.preventDefault()
    if (!query.trim()) {
      setError('Enter a city or area to search for theaters.')
      return
    }

    abortController.current?.abort()
    const controller = new AbortController()
    abortController.current = controller
    setIsSearching(true)
    setError('')
    setTheaters([])

    try {
      const place = await findLocation(query.trim(), controller.signal)
      if (controller.signal.aborted) return
      const results = await findNearbyCinemas(place, controller.signal)
      if (controller.signal.aborted) return
      setLocation(place)
      setTheaters(results)
      if (results.length === 0) {
        setError(`No listed cinemas found within 25 km of ${place.label}. Try another area.`)
      }
    } catch (searchError) {
      if (searchError.name !== 'AbortError') {
        console.error('Theater search failed:', searchError)
        setError(searchError.message || 'Could not search theaters. Please try again.')
      }
    } finally {
      if (!controller.signal.aborted) setIsSearching(false)
    }
  }

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Location is unavailable in this browser. Search for a city or area instead.')
      return
    }

    abortController.current?.abort()
    const controller = new AbortController()
    abortController.current = controller
    setIsSearching(true)
    setError('')

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        if (controller.signal.aborted) return
        const place = { lat: coords.latitude, lon: coords.longitude, label: 'Your current location' }
        try {
          const results = await findNearbyCinemas(place, controller.signal)
          if (controller.signal.aborted) return
          setLocation(place)
          setTheaters(results)
          if (results.length === 0) setError('No listed cinemas found within 25 km of your location.')
        } catch (searchError) {
          if (searchError.name !== 'AbortError') {
            console.error('Nearby theater search failed:', searchError)
            setError(searchError.message || 'Could not search theaters. Please try again.')
          }
        } finally {
          if (!controller.signal.aborted) setIsSearching(false)
        }
      },
      (geoError) => {
        if (controller.signal.aborted) return
        setIsSearching(false)
        setError(geoError.code === geoError.PERMISSION_DENIED
          ? 'Location permission was denied. Search for a city or area instead.'
          : 'Could not get your location. Search for a city or area instead.')
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 }
    )
  }

  return (
    <main className="content-width">
      <header className="page-header">
        <p className="eyebrow">Cinemas near you</p>
        <h1>Movie theaters</h1>
        <p>Find listed cinema venues near Tirupati or search another location.</p>
      </header>

      <form className="theater-location-form" onSubmit={search}>
        <label className="search-field">
          <FaSearch aria-hidden="true" />
          <input
            aria-label="City or area"
            placeholder="Enter your city or area"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <button className="btn btn-secondary location-button" type="button" onClick={useMyLocation} disabled={isSearching}>
          <FaLocationArrow /> Use my location
        </button>
        <button className="btn btn-primary location-submit" type="submit" disabled={isSearching}>
          {isSearching ? 'Searching…' : 'Find theaters'}
        </button>
      </form>

      <div className="theater-list-heading">
        <div>
          <h2><FaMapMarkerAlt /> Theaters near {location.label}</h2>
          <p>OpenStreetMap venue listings within 25 km. Listings may be incomplete.</p>
        </div>
        {!isSearching && <span className="theater-distance">{theaters.length} found</span>}
      </div>
      <aside className="provider-handoff theater-handoff">
        <div>
          <strong>Book live tickets with PVR INOX</strong>
          <p>Open PVR INOX to check its current movie listings, theaters, showtimes, and seats. Not every map-listed theater is a PVR venue.</p>
        </div>
        <a className="btn btn-primary" href="https://www.pvrcinemas.com/" target="_blank" rel="noreferrer">
          Open PVR INOX <FaExternalLinkAlt />
        </a>
      </aside>

      {error && <p className="message-error" role="alert">{error}</p>}
      {isSearching && <p className="location-result" role="status">Searching nearby cinema listings…</p>}
      {!isSearching && theaters.length > 0 && (
        <div className="theater-list">
          {theaters.map((theater) => (
            <article className="cinema-card" key={theater.id}>
              <div className="theater-card-top">
                <div className="cinema-title">
                  <strong>{theater.name}</strong>
                  <span>{theater.address}</span>
                </div>
                <span className="theater-distance">{theater.distanceKm.toFixed(1)} km</span>
              </div>
              <div className="cinema-actions">
                <a
                  href={getGoogleMapsDirectionsUrl(theater)}
                  className="map-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  Directions in Google Maps
                </a>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${theater.lat}&mlon=${theater.lon}#map=17/${theater.lat}/${theater.lon}`}
                  className="map-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  OpenStreetMap
                </a>
              </div>
            </article>
          ))}
          <p className="theater-attribution">
            Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>.
            Venue listings may be outdated. This page does not provide live showtimes, seat availability, or ticket booking.
          </p>
        </div>
      )}

      {!isSearching && !error && theaters.length === 0 && (
        <p className="empty-state">No theaters are listed for this location yet.</p>
      )}
    </main>
  )
}

export default Theaters
