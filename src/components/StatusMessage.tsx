type StatusMessageProps = {
  error: string
  message: string
}

export function StatusMessage({ error, message }: StatusMessageProps) {
  if (!error && !message) {
    return null
  }

  return <p className={error ? 'notice error' : 'notice success'}>{error || message}</p>
}
