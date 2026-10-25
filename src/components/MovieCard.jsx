import { Link } from 'react-router-dom'

const MovieCard = ({ movie }) => (
  <article className="movie-card">
    <Link to={`/movie/${movie.id}`} className="movie-poster" aria-label={`View ${movie.title}`}>
      <img src={movie.image} alt={`${movie.title} poster`} loading="lazy" />
      <span className="movie-rating">{movie.releaseYear} release</span>
    </Link>
    <div className="movie-card-body">
      <h3>{movie.title}</h3>
      <p className="movie-meta">{movie.language} · {movie.industry}</p>
      <div className="movie-tags">
        {movie.genres.slice(0, 2).map((genre) => <span className="movie-tag" key={genre}>{genre}</span>)}
      </div>
    </div>
  </article>
)

export default MovieCard
