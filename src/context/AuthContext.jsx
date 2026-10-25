import { createContext, useContext, useEffect, useState } from 'react'
import API_URL from '../config/api.js'

const AuthContext = createContext(null)
const USER_STORAGE_KEY = 'darshanUser'
const TOKEN_STORAGE_KEY = 'bookMyTicketsToken'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(USER_STORAGE_KEY)) || null
    } catch (error) {
      console.error('Could not read saved account:', error)
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY) || '')

  useEffect(() => {
    if (user && token) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
      localStorage.setItem(TOKEN_STORAGE_KEY, token)
    } else {
      localStorage.removeItem(USER_STORAGE_KEY)
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    }
  }, [user, token])

  const login = (userData) => {
    const sessionToken = userData.token
    if (!sessionToken) {
      throw new Error('The server did not provide an authentication session.')
    }
    const account = { ...userData }
    delete account.token
    delete account.notification
    setUser(account)
    setToken(sessionToken)
  }

  const logout = async () => {
    if (token) {
      try {
        const response = await fetch(`${API_URL}/api/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!response.ok) {
          console.error('Server logout failed:', await response.text())
        }
      } catch (error) {
        console.error('Could not end server session:', error)
      }
    }
    setUser(null)
    setToken('')
  }

  const authValue = {
    user,
    token,
    login,
    logout,
    isAuthenticated: Boolean(user && token)
  }

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
