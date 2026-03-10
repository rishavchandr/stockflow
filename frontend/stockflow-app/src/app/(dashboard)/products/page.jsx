'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import api from '../../../lib/api.js'
import Badge from '../../../components/ui/Badge.jsx'
import Modal from '../../../components/ui/Model.jsx'
import StockAdjust from '../../../components/products/Stockadjust.jsx'
import { formatCurrency } from '../../../lib/utils.js'
import {
  Plus, Search, Pencil, Trash2, AlertTriangle,
  RefreshCw, Package
} from 'lucide-react'

export default function ProductsPage() {
  const [products, setProducts]         = useState([])
  const [search, setSearch]             = useState('')
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting]         = useState(false)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const params = search ? { search } : {}
      const { data } = await api.get('/api/v1/products', { params })
      setProducts(data.products)
    } catch {
      setError('Failed to load products.')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300)
    return () => clearTimeout(timer)
  }, [fetchProducts])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await api.delete(`/api/v1/products/${deleteTarget.id}`)
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch {
      alert('Failed to delete product.')
    } finally {
      setDeleting(false)
    }
  }

  const handleStockAdjusted = (updated) => {
    setProducts((prev) =>
      prev.map((p) => p.id === updated.id ? { ...p, ...updated } : p)
    )
  }

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {loading ? '...' : `${products.length} product${products.length !== 1 ? 's' : ''}`}
        </p>
        <Link href="/products/new" className="btn-primary flex items-center gap-2">
          <Plus size={15} />
          Add Product
        </Link>
      </div>
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          className="input-base pl-9"
          placeholder="Search by name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="card overflow-hidden">
        {loading ? (
          <div className="divide-y divide-slate-50">
            {[1,2,3,4].map((i) => (
              <div key={i} className="px-5 py-4 flex gap-4 animate-pulse">
                <div className="h-4 bg-slate-100 rounded w-48" />
                <div className="h-4 bg-slate-100 rounded w-24" />
                <div className="h-4 bg-slate-100 rounded w-16 ml-auto" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-sm text-red-500 mb-3">{error}</p>
            <button onClick={fetchProducts} className="btn-secondary inline-flex items-center gap-2">
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Package size={20} className="text-slate-300" />
            </div>
            <p className="text-sm font-medium text-slate-700 mb-1">
              {search ? 'No products found' : 'No products yet'}
            </p>
            <p className="text-xs text-slate-400 mb-4">
              {search ? 'Try a different search term.' : 'Add your first product to get started.'}
            </p>
            {!search && (
              <Link href="/products/new" className="btn-primary inline-flex items-center gap-2">
                <Plus size={14} /> Add Product
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Product</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">SKU</th>
                  <th className="text-center px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Stock</th>
                  <th className="text-center px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Adjust</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Price</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-slate-900">{product.name}</p>
                      {product.description && (
                        <p className="text-xs text-slate-400 truncate max-w-[200px]">{product.description}</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {product.sku}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`text-sm font-semibold ${product.isLowStock ? 'text-red-500' : 'text-slate-900'}`}>
                        {product.quantityOnHand}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-center">
                        <StockAdjust
                          productId={product.id}
                          currentQty={product.quantityOnHand}
                          onAdjusted={handleStockAdjusted}
                        />
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-sm text-slate-700">
                        {formatCurrency(product.sellingPrice)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {product.isLowStock ? (
                        <Badge variant="danger">
                          <AlertTriangle size={11} className="mr-1" />
                          Low Stock
                        </Badge>
                      ) : (
                        <Badge variant="success">In Stock</Badge>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/products/${product.id}`}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-sky-50 hover:text-sky-600 text-slate-400 transition-all"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 hover:text-red-500 text-slate-400 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Product"
      >
        <p className="text-sm text-slate-600 mb-1">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-slate-900">{deleteTarget?.name}</span>?
        </p>
        <p className="text-xs text-slate-400 mb-5">This action cannot be undone.</p>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="btn-danger flex items-center gap-2"
          >
            {deleting && <RefreshCw size={13} className="animate-spin" />}
            {deleting ? 'Deleting...' : 'Yes, delete'}
          </button>
          <button onClick={() => setDeleteTarget(null)} className="btn-secondary">
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  )
}