import type { AuthForm, AuthMode, FormSubmitHandler } from '../../types/inventory'
import { StatusMessage } from '../../components/StatusMessage'

type AuthViewProps = {
  authForm: AuthForm
  authMode: AuthMode
  error: string
  isLoading: boolean
  message: string
  onAuthFormChange: (form: AuthForm) => void
  onAuthModeChange: (mode: AuthMode) => void
  onSubmit: FormSubmitHandler
}

export function AuthView({
  authForm,
  authMode,
  error,
  isLoading,
  message,
  onAuthFormChange,
  onAuthModeChange,
  onSubmit,
}: AuthViewProps) {
  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div>
          <p className="eyebrow">StockFlow MVP</p>
          <h1>Inventory control for small teams</h1>
          <p className="lede">
            Track products, quantities, selling prices, and low-stock risk from one
            focused workspace.
          </p>
        </div>

        <div className="auth-card">
          <div className="segmented" aria-label="Authentication mode">
            <button
              type="button"
              className={authMode === 'login' ? 'active' : ''}
              onClick={() => onAuthModeChange('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={authMode === 'signup' ? 'active' : ''}
              onClick={() => onAuthModeChange('signup')}
            >
              Signup
            </button>
          </div>

          <form onSubmit={onSubmit} className="stack">
            {authMode === 'signup' && (
              <label>
                Organization name
                <input
                  required
                  value={authForm.organizationName}
                  onChange={(event) =>
                    onAuthFormChange({
                      ...authForm,
                      organizationName: event.target.value,
                    })
                  }
                />
              </label>
            )}
            <label>
              Email
              <input
                required
                type="email"
                value={authForm.email}
                onChange={(event) =>
                  onAuthFormChange({ ...authForm, email: event.target.value })
                }
              />
            </label>
            <label>
              Password
              <input
                required
                minLength={6}
                type="password"
                value={authForm.password}
                onChange={(event) =>
                  onAuthFormChange({ ...authForm, password: event.target.value })
                }
              />
            </label>
            {authMode === 'signup' && (
              <label>
                Confirm password
                <input
                  required
                  minLength={6}
                  type="password"
                  value={authForm.confirmPassword}
                  onChange={(event) =>
                    onAuthFormChange({
                      ...authForm,
                      confirmPassword: event.target.value,
                    })
                  }
                />
              </label>
            )}

            <StatusMessage error={error} message={message} />
            <button className="primary-action" disabled={isLoading} type="submit">
              {isLoading ? 'Working...' : authMode === 'login' ? 'Log in' : 'Create account'}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
