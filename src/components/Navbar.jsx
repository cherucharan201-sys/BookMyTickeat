import { NavLink, useNavigate } from 'react-router-dom'
import { FaFilm, FaTicketAlt } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext.jsx'

const Navbar = () => {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand">
          <span className="brand-icon"><FaFilm /></span>
          <span>BookMyTickets</span>
        </NavLink>
        <nav className="nav-links" aria-label="Main navigation">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/movies">Movies</NavLink>
          <NavLink to="/theaters">Theaters</NavLink>
          <NavLink to="/bookings">My tickets</NavLink>
        </nav>
        <div className="nav-actions">
          {isAuthenticated ? (
            <button className="btn btn-secondary" type="button" onClick={() => { logout(); navigate('/') }}>
              Log out
            </button>
          ) : (
            <>
              <button className="btn btn-secondary" type="button" onClick={() => navigate('/login')}>
                Log in
              </button>
              <button className="btn btn-secondary" type="button" onClick={() => navigate('/register')}>
                Create account
              </button>
            </>
          )}
          <button className="btn btn-primary" type="button" onClick={() => navigate('/movies')}>
            <FaTicketAlt /> Book tickets
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
