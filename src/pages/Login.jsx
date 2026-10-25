import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import API_URL from '../config/api.js'

const Login = () => {
  const { login } = useAuth()
  const [formData, setFormData] = useState({ identifier: '', password: '' })
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: formData.identifier.trim(),
          password: formData.password
        })
      })
      const data = await res.json()
      if (res.ok) {
        const { notification, ...userData } = data
        login(userData)
        navigate(location.state?.from || '/bookings', { state: { loginNotification: notification } })
      } else {
        setMessageType('error')
        setMessage(data.message || 'Login failed.')
      }
    } catch (error) {
      console.error('Login request failed:', error)
      setMessageType('error')
      setMessage('Login service unavailable.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">Welcome back</p>
        <h1>Log in to BookMyTickets</h1>
        <p className="auth-description">Use the email address or phone number linked to your account.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="login-identifier">Email or phone number</label>
          <input
            id="login-identifier"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            type="text"
            autoComplete="username"
            placeholder="Email or phone number"
            required
          />
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            required
          />
          <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </button>
        {message && (
          <div className={`toast ${messageType}`} role="status" aria-live="polite">
            {message}
          </div>
        )}
        </form>
        <p className="auth-switch">New to BookMyTickets? <Link to="/register">Create an account</Link></p>
      </div>
    </section>
  )
}

export default Login
