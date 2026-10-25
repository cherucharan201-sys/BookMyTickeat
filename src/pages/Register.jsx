import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import API_URL from '../config/api.js'

const Register = () => {
  const { login } = useAuth()
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' })
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
      const res = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim()
        })
      })
      const data = await res.json()
      if (res.ok) {
        login(data)
        navigate(location.state?.from || '/bookings')
      } else {
        setMessageType('error')
        setMessage(data.message || 'Registration failed.')
      }
    } catch (error) {
      console.error('Registration request failed:', error)
      setMessageType('error')
      setMessage('Registration service unavailable.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">Join BookMyTickets</p>
        <h1>Create an account</h1>
        <p className="auth-description">Register with your email and phone number to use either when you log in.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="register-name">Full name</label>
          <input id="register-name" name="name" value={formData.name} onChange={handleChange} type="text" autoComplete="name" placeholder="Full name" required />
          <label htmlFor="register-email">Email</label>
          <input id="register-email" name="email" value={formData.email} onChange={handleChange} type="email" autoComplete="email" placeholder="Email address" required />
          <label htmlFor="register-phone">Phone number</label>
          <input id="register-phone" name="phone" value={formData.phone} onChange={handleChange} type="tel" autoComplete="tel" placeholder="Phone number" required />
          <label htmlFor="register-password">Password</label>
          <input id="register-password" name="password" value={formData.password} onChange={handleChange} type="password" autoComplete="new-password" placeholder="Password" required />
          <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        {message && (
          <div className={`toast ${messageType}`} role="status" aria-live="polite">
            {message}
          </div>
        )}
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </section>
  )
}

export default Register
