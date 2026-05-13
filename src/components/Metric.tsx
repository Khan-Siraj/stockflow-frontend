type MetricProps = {
  label: string
  value: number
}

export function Metric({ label, value }: MetricProps) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  )
}
