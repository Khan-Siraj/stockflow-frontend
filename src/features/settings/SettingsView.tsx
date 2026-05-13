import type { FormSubmitHandler } from '../../types/inventory'

type SettingsViewProps = {
  isLoading: boolean
  onSave: FormSubmitHandler
  setThresholdDraft: (value: string) => void
  thresholdDraft: string
}

export function SettingsView({
  isLoading,
  onSave,
  setThresholdDraft,
  thresholdDraft,
}: SettingsViewProps) {
  return (
    <section className="panel settings-panel">
      <div className="panel-heading">
        <div>
          <h3>Global defaults</h3>
          <p>Used when a product does not have its own low-stock threshold.</p>
        </div>
      </div>
      <form className="settings-form" onSubmit={onSave}>
        <label>
          Default low stock threshold
          <input
            min={0}
            required
            step={1}
            type="number"
            value={thresholdDraft}
            onChange={(event) => setThresholdDraft(event.target.value)}
          />
        </label>
        <button className="primary-action" disabled={isLoading} type="submit">
          {isLoading ? 'Saving...' : 'Save settings'}
        </button>
      </form>
    </section>
  )
}
