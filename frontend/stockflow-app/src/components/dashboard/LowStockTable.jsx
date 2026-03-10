import Link from 'next/link'
import { AlertTriangle, ArrowRight } from 'lucide-react'

export default function LowStockTable({ items }) {
  if (!items || items.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
          <AlertTriangle size={18} className="text-emerald-400" />
        </div>
        <p className="text-sm font-medium text-slate-700">All stocked up!</p>
        <p className="text-xs text-slate-400 mt-1">No products are below their low stock threshold.</p>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle size={15} className="text-amber-500" />
          <h2 className="text-sm font-semibold text-slate-900">Low Stock Items</h2>
          <span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 text-xs font-medium rounded-md">
            {items.length}
          </span>
        </div>
        <Link
          href="/products"
          className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 font-medium"
        >
          View all <ArrowRight size={12} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Name</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">SKU</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Qty on Hand</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Threshold</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3">
                  <Link href={`/products/${item.id}`} className="text-sm font-medium text-slate-900 hover:text-sky-600">
                    {item.name}
                  </Link>
                </td>
                <td className="px-5 py-3">
                  <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {item.sku}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <span className="text-sm font-semibold text-red-500">{item.quantityOnHand}</span>
                </td>
                <td className="px-5 py-3 text-right">
                  <span className="text-sm text-slate-500">{item.effectiveThreshold}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}