'use client'
import { useState } from 'react'
import { Loader2, Plus, Minus } from 'lucide-react'
import api from '../../lib/api'

export default function StockAdjust({ productId, currentQty, onAdjusted }) {
  const [value, setValue]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleAdjust = async (direction) => {
    const amount = parseInt(value)
    if (!value || isNaN(amount) || amount <= 0) {
      setError('Enter a valid number.')
      return
    }

    const adjustment = direction === 'add' ? amount : -amount

    if (currentQty + adjustment < 0) {
      setError('Stock cannot go below 0.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const { data } = await api.patch(`/api/v1/products/${productId}/adjust-stock`, { adjustment })
      onAdjusted(data.product)
      setValue('')
    } catch (err) {
      setError(err.response?.data?.message || 'Adjustment failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => handleAdjust('remove')}
          disabled={loading}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-500 text-slate-500 transition-all disabled:opacity-40"
        >
          <Minus size={14} />
        </button>

        <input
          type="number"
          min="1"
          className="input-base w-20 text-center"
          placeholder="0"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError('') }}
        />

        <button
          type="button"
          onClick={() => handleAdjust('add')}
          disabled={loading}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-500 text-slate-500 transition-all disabled:opacity-40"
        >
          {loading ? <Loader2 size={13} className="animate-spin" /> : <Plus size={14} />}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}