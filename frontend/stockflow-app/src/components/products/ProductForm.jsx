'use client'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function ProductForm({ initialData = {}, onSubmit, loading, submitLabel = 'Save' }) {
  const [form, setForm] = useState({
    name:              initialData.name              ?? '',
    sku:               initialData.sku               ?? '',
    description:       initialData.description       ?? '',
    quantityOnHand:    initialData.quantityOnHand    ?? 0,
    costPrice:         initialData.costPrice         ?? '',
    sellingPrice:      initialData.sellingPrice      ?? '',
    lowStockThreshold: initialData.lowStockThreshold ?? '',
  })

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Product Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            className="input-base"
            placeholder="e.g. Blue Widget"
            value={form.name}
            onChange={set('name')}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            SKU <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            className="input-base font-mono uppercase"
            placeholder="e.g. WGT-001"
            value={form.sku}
            onChange={set('sku')}
            required
          />
          <p className="mt-1 text-xs text-slate-400">Must be unique within your organization.</p>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Description <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <textarea
          className="input-base resize-none"
          rows={2}
          placeholder="Brief product description..."
          value={form.description}
          onChange={set('description')}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Quantity on Hand
          </label>
          <input
            type="number"
            min="0"
            className="input-base"
            placeholder="0"
            value={form.quantityOnHand}
            onChange={set('quantityOnHand')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Cost Price <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
            <input
              type="number"
              min="0"
              step="0.01"
              className="input-base pl-7"
              placeholder="0.00"
              value={form.costPrice}
              onChange={set('costPrice')}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Selling Price <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
            <input
              type="number"
              min="0"
              step="0.01"
              className="input-base pl-7"
              placeholder="0.00"
              value={form.sellingPrice}
              onChange={set('sellingPrice')}
            />
          </div>
        </div>
      </div>
      <div className="max-w-xs">
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Low Stock Threshold <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <input
          type="number"
          min="0"
          className="input-base"
          placeholder="Uses global default if empty"
          value={form.lowStockThreshold}
          onChange={set('lowStockThreshold')}
        />
        <p className="mt-1 text-xs text-slate-400">
          Alert when quantity drops to or below this number.
        </p>
      </div>
      <div className="pt-2 flex items-center gap-3">
        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
          {loading && <Loader2 size={14} className="animate-spin" />}
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}