
export const formatCurrency = (value) => {
  if (value === null || value === undefined) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export const isLowStock = (quantity, threshold, defaultThreshold = 5) => {
  const effective = threshold ?? defaultThreshold
  return quantity <= effective
}

export const cn = (...classes) => classes.filter(Boolean).join(' ')