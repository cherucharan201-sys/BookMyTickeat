import { Link } from 'react-router-dom'

const Footer = () => (
  <footer className="footer">
    <div className="content-width footer-inner">
      <Link to="/" className="brand footer-brand">BookMyTickets</Link>
      <p>Pick a movie. Pick your seats. Make a night of it.</p>
      <nav className="footer-links" aria-label="Footer navigation">
        <Link to="/movies">Movies</Link>
        <Link to="/theaters">Theaters</Link>
        <Link to="/bookings">My tickets</Link>
      </nav>
    </div>
  </footer>
)

export default Footer
