import { NavLink, useNavigate } from 'react-router-dom'
import { FaOm, FaUserCircle } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext.jsx'

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="navbar">
      <NavLink to="/" className="brand">
        <FaOm size={24} />
        <span>DarshanHome</span>
      </NavLink>

      <nav className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/temples">Temples</NavLink>
        <NavLink to="/bookings">My Bookings</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </nav>

      <div className="nav-actions">
        {isAuthenticated ? (
          <>
            <span style={{ color: '#1f2937', fontWeight: 700 }}>
              Hello, {user.name}
            </span>
            <button className="btn btn-light" type="button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="btn btn-light">Login</NavLink>
            <NavLink to="/register" className="btn btn-dark">
              <FaUserCircle /> Register
            </NavLink>
          </>
        )}
      </div>
    </header>
  )
}

export default Navbar
