'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '../../context/AuthContext.jsx'
import Sidebar from '../../components/layout/SIdeBar.jsx'
import Navbar from '../../components/layout/NavBar.jsx'

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/products':  'Products',
  '/settings':  'Settings',
}

const getTitle = (pathname) => {
  if (pathname.startsWith('/products/new'))  return 'Add Product'
  if (pathname.match(/\/products\/.+/))      return 'Edit Product'
  return PAGE_TITLES[pathname] || 'StockFlow'
}

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth()
  const router            = useRouter()
  const pathname          = usePathname()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-400">
          <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="ml-56">
        <Navbar title={getTitle(pathname)} />
        <main className="p-6 animate-slide-in">
          {children}
        </main>
      </div>
    </div>
  )
}