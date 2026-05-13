export function formatMoney(value?: number | null) {
  if (value == null) {
    return '-'
  }

  return new Intl.NumberFormat(undefined, {
    currency: 'USD',
    style: 'currency',
  }).format(value)
}

export function viewTitle(view: 'dashboard' | 'products' | 'settings') {
  if (view === 'dashboard') {
    return 'Dashboard'
  }

  if (view === 'products') {
    return 'Product management'
  }

  return 'Settings'
}
