'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import api from '../../../../lib/api'
import ProductForm from '../../../../components/products/ProductForm'
import { ArrowLeft, Loader2 } from 'lucide-react'

export default function ProductEditPage() {
  const { id }                = useParams()
  const router                = useRouter()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/api/v1/products/${id}`)
        setProduct(data.product)
      } catch {
        setError('Product not found.')
      } finally {
        setFetching(false)
      }
    }
    fetch()
  }, [id])

  const handleSubmit = async (formData) => {
    setLoading(true)
    setError('')
    try {
      await api.put(`/api/v1/products/${id}`, formData)
      router.push('/products')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="max-w-2xl">
        <div className="card p-6 space-y-4 animate-pulse">
          <div className="h-5 bg-slate-100 rounded w-48" />
          <div className="h-4 bg-slate-100 rounded w-full" />
          <div className="h-4 bg-slate-100 rounded w-3/4" />
          <div className="h-10 bg-slate-100 rounded w-full" />
          <div className="h-10 bg-slate-100 rounded w-full" />
        </div>
      </div>
    )
  }

  if (error && !product) {
    return (
      <div className="max-w-2xl">
        <div className="card p-8 text-center">
          <p className="text-sm text-red-500 mb-3">{error}</p>
          <Link href="/products" className="btn-secondary inline-flex items-center gap-2">
            <ArrowLeft size={14} /> Back to Products
          </Link>
        </div>
      </div>
    )
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
        <h2 className="text-base font-semibold text-slate-900 mb-1">Edit Product</h2>
        <p className="text-sm text-slate-500 mb-6">
          Update the details for{' '}
          <span className="font-medium text-slate-700">{product?.name}</span>
        </p>

        {error && (
          <div className="mb-5 px-3 py-2.5 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <ProductForm
          initialData={product}
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  )
}