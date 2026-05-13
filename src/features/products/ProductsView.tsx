import type {
  FormSubmitHandler,
  Product,
  ProductForm,
} from '../../types/inventory'
import { ProductTable } from '../../components/ProductTable'

type ProductsViewProps = {
  defaultThreshold: number
  filteredProducts: Product[]
  form: ProductForm
  isLoading: boolean
  onDelete: (product: Product) => void
  onEdit: (product: Product) => void
  onFormChange: (form: ProductForm) => void
  onResetForm: () => void
  onSave: FormSubmitHandler
  query: string
  setQuery: (query: string) => void
}

export function ProductsView({
  defaultThreshold,
  filteredProducts,
  form,
  isLoading,
  onDelete,
  onEdit,
  onFormChange,
  onResetForm,
  onSave,
  query,
  setQuery,
}: ProductsViewProps) {
  return (
    <div className="products-layout">
      <section className="panel product-form-panel">
        <div className="panel-heading">
          <div>
            <h3>{form.id ? 'Edit product' : 'Add product'}</h3>
            <p>Name, SKU, quantity, prices, and threshold.</p>
          </div>
        </div>
        <form className="product-form" onSubmit={onSave}>
          <label>
            Name
            <input
              required
              value={form.name}
              onChange={(event) => onFormChange({ ...form, name: event.target.value })}
            />
          </label>
          <label>
            SKU
            <input
              required
              value={form.sku}
              onChange={(event) => onFormChange({ ...form, sku: event.target.value })}
            />
          </label>
          <label className="span-2">
            Description
            <textarea
              rows={3}
              value={form.description}
              onChange={(event) =>
                onFormChange({ ...form, description: event.target.value })
              }
            />
          </label>
          <label>
            Quantity on hand
            <input
              required
              min={0}
              step={1}
              type="number"
              value={form.quantity}
              onChange={(event) => onFormChange({ ...form, quantity: event.target.value })}
            />
          </label>
          <label>
            Low stock threshold
            <input
              min={0}
              step={1}
              type="number"
              placeholder={String(defaultThreshold)}
              value={form.lowStockThreshold}
              onChange={(event) =>
                onFormChange({ ...form, lowStockThreshold: event.target.value })
              }
            />
          </label>
          <label>
            Cost price
            <input
              min={0}
              step="0.01"
              type="number"
              value={form.costPrice}
              onChange={(event) =>
                onFormChange({ ...form, costPrice: event.target.value })
              }
            />
          </label>
          <label>
            Selling price
            <input
              min={0}
              step="0.01"
              type="number"
              value={form.sellingPrice}
              onChange={(event) =>
                onFormChange({ ...form, sellingPrice: event.target.value })
              }
            />
          </label>
          <div className="form-actions span-2">
            {form.id && (
              <button className="ghost-action" onClick={onResetForm} type="button">
                Cancel
              </button>
            )}
            <button className="primary-action" disabled={isLoading} type="submit">
              {isLoading ? 'Saving...' : form.id ? 'Save changes' : 'Add product'}
            </button>
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="panel-heading table-heading">
          <div>
            <h3>Products</h3>
            <p>{filteredProducts.length} visible</p>
          </div>
          <input
            aria-label="Search products"
            className="search-input"
            placeholder="Search name or SKU"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <ProductTable
          defaultThreshold={defaultThreshold}
          emptyText="No products yet."
          mode="products"
          onDelete={onDelete}
          onEdit={onEdit}
          products={filteredProducts}
          showDelete
        />
      </section>
    </div>
  )
}
