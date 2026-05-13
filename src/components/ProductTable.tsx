import type { Product } from '../types/inventory'
import { formatMoney } from '../utils/format'

type ProductTableProps = {
  defaultThreshold: number
  emptyText: string
  mode: 'dashboard' | 'products'
  onDelete?: (product: Product) => void
  onEdit: (product: Product) => void
  products: Product[]
  showDelete: boolean
}

export function ProductTable({
  defaultThreshold,
  emptyText,
  mode,
  onDelete,
  onEdit,
  products,
  showDelete,
}: ProductTableProps) {
  if (products.length === 0) {
    return <p className="empty-state">{emptyText}</p>
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Quantity</th>
            {mode === 'dashboard' ? (
              <th>Low stock threshold</th>
            ) : (
              <>
                <th>Status</th>
                <th>Selling price</th>
              </>
            )}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const threshold = product.lowStockThreshold ?? defaultThreshold
            const isLowStock = product.quantity <= threshold

            return (
              <tr key={product.id}>
                <td>
                  <strong>{product.name}</strong>
                </td>
                <td>{product.sku}</td>
                <td>{product.quantity}</td>
                {mode === 'dashboard' ? (
                  <td>{threshold}</td>
                ) : (
                  <>
                    <td>
                      <span className={isLowStock ? 'status low' : 'status ok'}>
                        {isLowStock ? 'Low stock' : 'In stock'}
                      </span>
                    </td>
                    <td>{formatMoney(product.sellingPrice)}</td>
                  </>
                )}
                <td>
                  <div className="row-actions">
                    <button type="button" onClick={() => onEdit(product)}>
                      Edit
                    </button>
                    {showDelete && onDelete && (
                      <button type="button" onClick={() => onDelete(product)}>
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
