'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '../lib/api.js'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)
  const router                = useRouter()

  useEffect(() => {
    const token     = localStorage.getItem('sf_token')
    const savedUser = localStorage.getItem('sf_user')
    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/api/v1/user/login', { email, password })
    localStorage.setItem('sf_token', data.token)
    localStorage.setItem('sf_user', JSON.stringify(data.user))
    document.cookie = `sf_token=${data.token}; path=/`
    setUser(data.user)
    router.push('/dashboard')
  }

  const signup = async (email, password, confirmPassword, organisationName) => {
    const { data } = await api.post('/api/v1/user/signup', {
      email,
      password,
      organisationName,
    })
    localStorage.setItem('sf_token', data.token)
    localStorage.setItem('sf_user', JSON.stringify(data.user))
    document.cookie = `sf_token=${data.token}; path=/`
    setUser(data.user)
    router.push('/dashboard')
  }

  const logout = () => {
    localStorage.removeItem('sf_token')
    localStorage.removeItem('sf_user')
    setUser(null)
    router.push('/auth/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}