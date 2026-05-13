import type { Product } from '../../types/inventory'
import { Metric } from '../../components/Metric'
import { ProductTable } from '../../components/ProductTable'

type DashboardViewProps = {
  defaultThreshold: number
  lowStockItems: Product[]
  onEditProduct: (product: Product) => void
  totalProducts: number
  totalQuantity: number
}

export function DashboardView({
  defaultThreshold,
  lowStockItems,
  onEditProduct,
  totalProducts,
  totalQuantity,
}: DashboardViewProps) {
  return (
    <div className="view-stack">
      <section className="metrics-grid">
        <Metric label="Total products" value={totalProducts} />
        <Metric label="Units on hand" value={totalQuantity} />
        <Metric label="Low stock items" value={lowStockItems.length} />
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h3>Low stock items</h3>
            <p>Products at or below their threshold.</p>
          </div>
        </div>
        <ProductTable
          defaultThreshold={defaultThreshold}
          emptyText="No low-stock products right now."
          mode="dashboard"
          onEdit={onEditProduct}
          products={lowStockItems}
          showDelete={false}
        />
      </section>
    </div>
  )
}
