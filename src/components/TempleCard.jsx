import { Link } from 'react-router-dom'

const TempleCard = ({ name, location, image, tag }) => {
  return (
    <article className="temple-card">
      <img src={image} alt={name} />
      <div className="temple-card-body">
        <span className="pill">{tag}</span>
        <h3>{name}</h3>
        <p>{location}</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
          <Link to={`/temple/${encodeURIComponent(name)}`} className="btn btn-light small">
            View Details
          </Link>
          <Link to={`/booking?temple=${encodeURIComponent(name)}`} className="btn btn-dark small">
            Book Now
          </Link>
        </div>
      </div>
    </article>
  )
}

export default TempleCard
