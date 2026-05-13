import { type FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'
import { API_URL, TOKEN_KEY, emptyProductForm } from './constants/inventory'
import { AuthView } from './features/auth/AuthView'
import { DashboardView } from './features/dashboard/DashboardView'
import { ProductsView } from './features/products/ProductsView'
import { SettingsView } from './features/settings/SettingsView'
import { AppLayout } from './layouts/AppLayout'
import type { AuthForm, AuthMode, Product, ProductForm, View } from './types/inventory'

function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) ?? '')
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [authForm, setAuthForm] = useState<AuthForm>({
    organizationName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [products, setProducts] = useState<Product[]>([])
  const [defaultThreshold, setDefaultThreshold] = useState(5)
  const [thresholdDraft, setThresholdDraft] = useState('5')
  const [productForm, setProductForm] = useState<ProductForm>(emptyProductForm)
  const [query, setQuery] = useState('')
  const [activeView, setActiveView] = useState<View>('dashboard')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleLogout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken('')
    setProducts([])
    setProductForm(emptyProductForm)
    setActiveView('dashboard')
  }, [])

  const authedFetch = useCallback(
    async <T,>(path: string, init: RequestInit = {}) => {
      const response = await fetch(`${API_URL}${path}`, {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...init.headers,
        },
      })

      if (response.status === 401) {
        handleLogout()
        throw new Error('Session expired. Please log in again.')
      }

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.message ?? 'Request failed')
      }

      return response.json() as Promise<T>
    },
    [handleLogout, token],
  )

  const loadWorkspace = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const [productData, settingsData] = await Promise.all([
        authedFetch<Product[]>('/products'),
        authedFetch<{ defaultLowStockValue: number }>('/settings').catch(() => ({
          defaultLowStockValue: 5,
        })),
      ])
      setProducts(productData)
      setDefaultThreshold(settingsData.defaultLowStockValue)
      setThresholdDraft(String(settingsData.defaultLowStockValue))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load workspace')
    } finally {
      setIsLoading(false)
    }
  }, [authedFetch])

  useEffect(() => {
    if (!token) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      void loadWorkspace()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [loadWorkspace, token])

  const dashboard = useMemo(() => {
    const lowStockItems = products.filter((product) => {
      const threshold = product.lowStockThreshold ?? defaultThreshold
      return product.quantity <= threshold
    })

    return {
      totalProducts: products.length,
      totalQuantity: products.reduce((total, product) => total + product.quantity, 0),
      lowStockItems,
    }
  }, [defaultThreshold, products])

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return products
    }

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.sku.toLowerCase().includes(normalizedQuery)
      )
    })
  }, [products, query])

  const handleAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (authMode === 'signup' && authForm.password !== authForm.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      const payload =
        authMode === 'signup'
          ? {
              organizationName: authForm.organizationName.trim(),
              email: authForm.email.trim(),
              password: authForm.password,
            }
          : {
              email: authForm.email.trim(),
              password: authForm.password,
            }

      const response = await fetch(`${API_URL}/auth/${authMode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.message ?? 'Authentication failed')
      }

      const data = (await response.json()) as { access_token: string }
      localStorage.setItem(TOKEN_KEY, data.access_token)
      setToken(data.access_token)
      setActiveView('dashboard')
      setMessage(authMode === 'signup' ? 'Account created' : 'Logged in')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setMessage('')

    const payload = {
      name: productForm.name.trim(),
      sku: productForm.sku.trim(),
      description: productForm.description.trim() || undefined,
      quantity: Number(productForm.quantity || 0),
      costPrice: productForm.costPrice === '' ? undefined : Number(productForm.costPrice),
      sellingPrice:
        productForm.sellingPrice === '' ? undefined : Number(productForm.sellingPrice),
      lowStockThreshold:
        productForm.lowStockThreshold === ''
          ? undefined
          : Number(productForm.lowStockThreshold),
    }

    if (!payload.name || !payload.sku) {
      setError('Name and SKU are required')
      return
    }

    setIsLoading(true)

    try {
      if (productForm.id) {
        await authedFetch<Product>(`/products/${productForm.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        })
        setMessage('Product updated')
      } else {
        await authedFetch<Product>('/products', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        setMessage('Product created')
      }

      setProductForm(emptyProductForm)
      await loadWorkspace()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save product')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditProduct = (product: Product) => {
    setProductForm({
      id: product.id,
      name: product.name,
      sku: product.sku,
      description: product.description ?? '',
      quantity: String(product.quantity),
      costPrice: product.costPrice == null ? '' : String(product.costPrice),
      sellingPrice: product.sellingPrice == null ? '' : String(product.sellingPrice),
      lowStockThreshold:
        product.lowStockThreshold == null ? '' : String(product.lowStockThreshold),
    })
    setActiveView('products')
  }

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`Delete ${product.name}?`)) {
      return
    }

    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      await authedFetch<Product>(`/products/${product.id}`, { method: 'DELETE' })
      setMessage('Product deleted')
      if (productForm.id === product.id) {
        setProductForm(emptyProductForm)
      }
      await loadWorkspace()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete product')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      const updated = await authedFetch<{ defaultLowStockValue: number }>('/settings', {
        method: 'PATCH',
        body: JSON.stringify({ defaultLowStockValue: Number(thresholdDraft || 5) }),
      })
      setDefaultThreshold(updated.defaultLowStockValue)
      setThresholdDraft(String(updated.defaultLowStockValue))
      setMessage('Settings saved')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save settings')
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <AuthView
        authForm={authForm}
        authMode={authMode}
        error={error}
        isLoading={isLoading}
        message={message}
        onAuthFormChange={setAuthForm}
        onAuthModeChange={setAuthMode}
        onSubmit={handleAuth}
      />
    )
  }

  return (
    <AppLayout
      activeView={activeView}
      error={error}
      message={message}
      onLogout={handleLogout}
      onRefresh={loadWorkspace}
      onViewChange={setActiveView}
    >
      {activeView === 'dashboard' && (
        <DashboardView
          defaultThreshold={defaultThreshold}
          lowStockItems={dashboard.lowStockItems}
          onEditProduct={handleEditProduct}
          totalProducts={dashboard.totalProducts}
          totalQuantity={dashboard.totalQuantity}
        />
      )}

      {activeView === 'products' && (
        <ProductsView
          defaultThreshold={defaultThreshold}
          filteredProducts={filteredProducts}
          form={productForm}
          isLoading={isLoading}
          onDelete={handleDeleteProduct}
          onEdit={handleEditProduct}
          onFormChange={setProductForm}
          onResetForm={() => setProductForm(emptyProductForm)}
          onSave={handleSaveProduct}
          query={query}
          setQuery={setQuery}
        />
      )}

      {activeView === 'settings' && (
        <SettingsView
          isLoading={isLoading}
          onSave={handleSaveSettings}
          setThresholdDraft={setThresholdDraft}
          thresholdDraft={thresholdDraft}
        />
      )}
    </AppLayout>
  )
}

export default App
