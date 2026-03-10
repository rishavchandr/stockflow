'use client'
import { useAuth } from '../../context/AuthContext'
import { LogOut, ChevronDown, Building2 } from 'lucide-react'
import { useState } from 'react'

export default function Navbar({ title }) {
  const { user } = useAuth()
  const [open, setOpen]  = useState(false)

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20">
      <h1 className="text-sm font-semibold text-slate-900">{title}</h1>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-all duration-150"
        >
          <div className="w-6 h-6 bg-sky-100 rounded-md flex items-center justify-center">
            <Building2 size={13} className="text-sky-600" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-medium text-slate-900 leading-tight">
              {user?.organizationName || 'My Org'}
            </p>
            <p className="text-xs text-slate-400 leading-tight">{user?.email}</p>
          </div>
          <ChevronDown size={14} className="text-slate-400" />
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 animate-fade-in">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-medium text-slate-900">{user?.organizationName}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  )
}