import { cn } from '../../lib/utils'

export default function Badge({ variant = 'default', children }) {
  const variants = {
    default:  'bg-slate-100 text-slate-600',
    success:  'bg-emerald-50 text-emerald-600',
    warning:  'bg-amber-50 text-amber-600',
    danger:   'bg-red-50 text-red-600',
    info:     'bg-sky-50 text-sky-600',
  }

  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium', variants[variant])}>
      {children}
    </span>
  )
}