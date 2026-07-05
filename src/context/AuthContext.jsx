import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('darshanUser')) || null
    } catch (error) {
      return null
    }
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('darshanUser', JSON.stringify(user))
    } else {
      localStorage.removeItem('darshanUser')
    }
  }, [user])

  const login = (userData) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
  }

  const authValue = {
    user,
    login,
    logout,
    isAuthenticated: Boolean(user)
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
