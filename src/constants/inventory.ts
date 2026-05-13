import type { ProductForm } from '../types/inventory'

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
export const TOKEN_KEY = 'stockflow_token'

export const emptyProductForm: ProductForm = {
  name: '',
  sku: '',
  description: '',
  quantity: '0',
  costPrice: '',
  sellingPrice: '',
  lowStockThreshold: '',
}
