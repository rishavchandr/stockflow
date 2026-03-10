import { Package, Layers, AlertTriangle } from 'lucide-react'

const Card = ({ icon: Icon, label, value, color }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon size={18} strokeWidth={2} />
    </div>
    <div>
      <p className="text-xs text-slate-500 font-medium mb-0.5">{label}</p>
      <p className="text-2xl font-semibold text-slate-900 leading-none">{value}</p>
    </div>
  </div>
)

export default function SummaryCards({ totalProducts, totalQuantity, lowStockCount }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card
        icon={Package}
        label="Total Products"
        value={totalProducts}
        color="bg-sky-50 text-sky-500"
      />
      <Card
        icon={Layers}
        label="Total Units in Stock"
        value={totalQuantity}
        color="bg-emerald-50 text-emerald-500"
      />
      <Card
        icon={AlertTriangle}
        label="Low Stock Items"
        value={lowStockCount}
        color={lowStockCount > 0 ? 'bg-amber-50 text-amber-500' : 'bg-slate-50 text-slate-400'}
      />
    </div>
  )
}