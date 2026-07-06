import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import API_URL from '../config/api.js'

const Login = () => {
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (res.ok) {
        login(data)
        setMessageType('success')
        setMessage('Login successful. Redirecting to your bookings...')
        setTimeout(() => navigate('/bookings'), 1200)
      } else {
        setMessageType('error')
        setMessage(data.message || 'Login failed.')
      }
    } catch (error) {
      setMessageType('error')
      setMessage('Login service unavailable.')
    }
  }

  return (
    <section className="page-card">
      <h2>Login</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Email" required />
        <input name="password" value={formData.password} onChange={handleChange} type="password" placeholder="Password" required />
        <button className="btn btn-dark" type="submit">Log In</button>
        {message && (
          <div className={`toast ${messageType}`} style={{ marginTop: 16 }}>
            {message}
          </div>
        )}
      </form>
    </section>
  )
}

export default Login
