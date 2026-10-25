import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import MovieCard from '../components/MovieCard.jsx'
import { movies } from '../data/movies.js'

const Movies = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState('All movies')
  const categories = ['All movies', ...new Set(movies.map((movie) => movie.language))]

  const visibleMovies = useMemo(() => {
    const searchTerm = query.trim().toLowerCase()
    return movies.filter((movie) => {
      const matchesSearch = !searchTerm || [
        movie.title,
        movie.language,
        movie.industry,
        movie.genres.join(' ')
      ].some((value) => value.toLowerCase().includes(searchTerm))
      const matchesCategory = category === 'All movies' || movie.language === category
      return matchesSearch && matchesCategory
    })
  }, [query, category])

  const handleSearch = (event) => {
    setQuery(event.target.value)
    const nextParams = new URLSearchParams(searchParams)
    if (event.target.value.trim()) nextParams.set('q', event.target.value.trim())
    else nextParams.delete('q')
    setSearchParams(nextParams, { replace: true })
  }

  return (
    <main className="content-width">
      <header className="page-header">
        <p className="eyebrow">Indian cinema · 2026</p>
        <h1>2026 Indian movie releases</h1>
        <p>Explore releases from Hindi, Tamil, Telugu, Malayalam, and Kannada cinema.</p>
      </header>
      <div className="catalog-tools">
        <label className="search-field">
          <FaSearch aria-hidden="true" />
          <input
            aria-label="Search movies"
            placeholder="Search movies, languages or film industries"
            value={query}
            onChange={handleSearch}
          />
        </label>
      </div>
      <div className="category-list" aria-label="Filter by language">
        {categories.map((item) => (
          <button
            className={`category-chip${category === item ? ' selected' : ''}`}
            type="button"
            key={item}
            onClick={() => setCategory(item)}
            aria-pressed={category === item}
          >
            {item}
          </button>
        ))}
      </div>
      {visibleMovies.length > 0 ? (
        <div className="movie-grid" style={{ paddingBottom: 64 }}>
          {visibleMovies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No movies found</h2>
          <p>Try a different title, language, or genre.</p>
        </div>
      )}
    </main>
  )
}

export default Movies
