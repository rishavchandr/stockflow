'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../../../context/AuthContext.jsx'
import { Eye, EyeOff, Loader2, Building2 } from 'lucide-react'

export default function SignupPage() {
  const { signup }                        = useAuth()
  const [orgName, setOrgName]             = useState('')
  const [email, setEmail]                 = useState('')
  const [password, setPassword]           = useState('')
  const [confirmPassword, setConfirm]     = useState('')
  const [showPassword, setShowPassword]   = useState(false)
  const [error, setError]                 = useState('')
  const [loading, setLoading]             = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      return setError('Passwords do not match.')
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters.')
    }

    setLoading(true)
    try {
      await signup(email, password, confirmPassword, orgName)
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-8 animate-slide-in">
      <h1 className="text-xl font-semibold text-slate-900 mb-1">Create your account</h1>
      <p className="text-sm text-slate-500 mb-6">Get started with StockFlow for free</p>

      {error && (
        <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Organization name
          </label>
          <div className="relative">
            <Building2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              className="input-base pl-9"
              placeholder="My Store"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <p className="mt-1 text-xs text-slate-400">This is your workspace name — e.g. your store or business name.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Email address
          </label>
          <input
            type="email"
            className="input-base"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="input-base pr-10"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Confirm password
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            className="input-base"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center flex items-center gap-2 mt-2">
          {loading && <Loader2 size={15} className="animate-spin" />}
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link href="/login" className="text-sky-600 font-medium hover:text-sky-700">
          Sign in
        </Link>
      </p>
    </div>
  )
}