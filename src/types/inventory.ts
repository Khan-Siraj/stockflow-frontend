import type { FormEvent } from 'react'

export type View = 'dashboard' | 'products' | 'settings'
export type AuthMode = 'login' | 'signup'

export type Product = {
  id: string
  name: string
  sku: string
  description?: string | null
  quantity: number
  costPrice?: number | null
  sellingPrice?: number | null
  lowStockThreshold?: number | null
}

export type ProductForm = {
  id?: string
  name: string
  sku: string
  description: string
  quantity: string
  costPrice: string
  sellingPrice: string
  lowStockThreshold: string
}

export type AuthForm = {
  organizationName: string
  email: string
  password: string
  confirmPassword: string
}

export type DashboardSummary = {
  totalProducts: number
  totalQuantity: number
  lowStockItems: Product[]
}

export type FormSubmitHandler = (event: FormEvent<HTMLFormElement>) => void
