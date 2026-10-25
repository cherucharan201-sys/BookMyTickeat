import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaArrowRight, FaBolt, FaFilm, FaSearch, FaTicketAlt } from 'react-icons/fa'
import MovieCard from '../components/MovieCard.jsx'
import { movies } from '../data/movies.js'

const Home = () => {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const handleSearch = (event) => {
    event.preventDefault()
    navigate(`/movies${search.trim() ? `?q=${encodeURIComponent(search.trim())}` : ''}`)
  }

  return (
    <main>
      <section className="home-hero content-width">
        <div className="hero-copy">
          <p className="eyebrow">Movie nights, made easy</p>
          <h1>Big screen.<br />Best seats.<br />Your night.</h1>
          <p className="hero-text">Find a movie you love, pick your seats, and make tonight a cinema night.</p>
          <div className="hero-actions">
            <Link to="/movies" className="btn btn-primary">Explore movies <FaArrowRight /></Link>
            <Link to="/bookings" className="btn btn-secondary"><FaTicketAlt /> My tickets</Link>
          </div>
          <p className="hero-note"><strong>All the latest stories</strong> · Search movies and browse showtimes</p>
        </div>
      </section>

      <section className="content-width section">
        <form className="search-field" onSubmit={handleSearch} role="search">
          <FaSearch aria-hidden="true" />
          <input
            aria-label="Search movies"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by movie, genre or language"
          />
          <button className="btn btn-primary" type="submit">Search</button>
        </form>
      </section>

      <section className="content-width section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Indian cinema · 2026 releases</p>
            <h2>Stories from across India</h2>
          </div>
          <Link className="text-link" to="/movies">See all movies <FaArrowRight /></Link>
        </div>
        <div className="movie-grid">
          {movies.slice(0, 4).map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        </div>
      </section>

      <section className="content-width feature-strip" aria-label="Booking benefits">
        <div className="feature-item">
          <span className="feature-icon"><FaFilm /></span>
          <div><strong>Find your film</strong><span>Browse a hand-picked movie lineup</span></div>
        </div>
        <div className="feature-item">
          <span className="feature-icon"><FaTicketAlt /></span>
          <div><strong>Choose your seats</strong><span>Pick the perfect spot in the theatre</span></div>
        </div>
        <div className="feature-item">
          <span className="feature-icon"><FaBolt /></span>
          <div><strong>Keep your tickets close</strong><span>Your demo tickets are saved to your account</span></div>
        </div>
      </section>
    </main>
  )
}

export default Home
