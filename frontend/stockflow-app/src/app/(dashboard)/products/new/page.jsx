'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '../../../../lib/api'
import ProductForm from '../../../../components/products/ProductForm'
import { ArrowLeft } from 'lucide-react'

export default function ProductCreatePage() {
  const router          = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleSubmit = async (formData) => {
    setLoading(true)
    setError('')
    try {
      await api.post('/api/v1/products', formData)
      router.push('/products')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-5 transition-colors"
      >
        <ArrowLeft size={15} /> Back to Products
      </Link>

      <div className="card p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-1">Add New Product</h2>
        <p className="text-sm text-slate-500 mb-6">Fill in the details below to add a product to your inventory.</p>

        {error && (
          <div className="mb-5 px-3 py-2.5 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <ProductForm
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Create Product"
        />
      </div>
    </div>
  )
}