'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Settings, TrendingUp } from 'lucide-react'
import { cn } from '../../lib/utils'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard',  icon: LayoutDashboard },
  { label: 'Products',  href: '/products',   icon: Package },
  { label: 'Settings',  href: '/settings',   icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-white border-r border-slate-200 flex flex-col z-30">
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-sky-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <TrendingUp size={14} color="white" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-slate-900 tracking-tight">StockFlow</span>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-sky-50 text-sky-600'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <Icon size={16} strokeWidth={active ? 2.5 : 2} />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="px-4 py-4 border-t border-slate-100">
        <p className="text-xs text-slate-400">StockFlow MVP v0.1</p>
      </div>
    </aside>
  )
}