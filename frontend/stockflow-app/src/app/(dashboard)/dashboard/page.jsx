'use client'
import { useState, useEffect } from 'react'
import api from '../../../lib/api.js'
import SummaryCards from '../../../components/dashboard/SummaryCard.jsx'
import LowStockTable from '../../../components/dashboard/LowStockTable.jsx'
import { useAuth } from '../../../context/AuthContext.jsx'
import { RefreshCw } from 'lucide-react'

export default function DashboardPage() {
  const { user }            = useAuth()
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      setError('')
      const { data: res } = await api.get('/api/v1/dashboard')
      setData(res)
    } catch (err) {
      setError('Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDashboard() }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-5 h-20 animate-pulse bg-slate-100" />
          ))}
        </div>
        <div className="card h-48 animate-pulse bg-slate-100" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-8 text-center">
        <p className="text-sm text-red-500 mb-3">{error}</p>
        <button onClick={fetchDashboard} className="btn-secondary inline-flex items-center gap-2">
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Welcome back, {user?.organizationName} 👋
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Here&apos;s a snapshot of your inventory today.
          </p>
        </div>
        <button
          onClick={fetchDashboard}
          className="btn-secondary flex items-center gap-2"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>
      <SummaryCards
        totalProducts={data?.totalProducts ?? 0}
        totalQuantity={data?.totalQuantityOnHand ?? 0}
        lowStockCount={data?.lowStockCount ?? 0}
      />
      <div>
        <LowStockTable items={data?.lowStockItems ?? []} />
      </div>
    </div>
  )
}