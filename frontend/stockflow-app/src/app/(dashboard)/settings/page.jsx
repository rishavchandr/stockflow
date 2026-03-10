'use client'
import { useState, useEffect } from 'react'
import api from '../../../lib/api'
import { Loader2, Save, Settings2 } from 'lucide-react'

export default function SettingsPage() {
  const [threshold, setThreshold] = useState('')
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [success, setSuccess]     = useState(false)
  const [error, setError]         = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/api/v1/settings')
        setThreshold(data.settings.defaultLowStockThreshold)
      } catch {
        setError('Failed to load settings.')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      await api.put('/api/v1/settings', { defaultLowStockThreshold: threshold })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save settings.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl space-y-6">

      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
            <Settings2 size={16} className="text-slate-500" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Inventory Settings</h2>
            <p className="text-xs text-slate-400">Global defaults for your organization.</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-slate-100 rounded w-40" />
            <div className="h-10 bg-slate-100 rounded w-full" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5">

            {error && (
              <div className="px-3 py-2.5 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}
            {success && (
              <div className="px-3 py-2.5 bg-emerald-50 border border-emerald-100 rounded-lg text-sm text-emerald-600">
                ✓ Settings saved successfully.
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Default Low Stock Threshold
              </label>
              <input
                type="number"
                min="0"
                className="input-base max-w-xs"
                placeholder="e.g. 5"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                required
              />
              <p className="mt-1.5 text-xs text-slate-400">
                Products without a custom threshold will use this value to determine low stock status.
              </p>
            </div>

            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        )}
      </div>

      <div className="card p-5 bg-sky-50 border-sky-100">
        <p className="text-xs font-medium text-sky-700 mb-1">How thresholds work</p>
        <p className="text-xs text-sky-600 leading-relaxed">
          Each product can have its own low stock threshold. If a product doesn&apos;t have one set,
          this global default is used. A product is marked as low stock when its quantity on hand
          is less than or equal to the threshold.
        </p>
      </div>
    </div>
  )
}