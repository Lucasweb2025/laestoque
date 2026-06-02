const variants = {
  success: 'border-success-border bg-success-bg text-success-text',
  danger: 'border-danger-border bg-danger-bg text-danger-text',
  warning: 'border-amber-200 bg-warning-bg text-warning-text',
  neutral: 'border-border bg-slate-50 text-text-secondary',
  primary: 'border-blue-200 bg-primary-muted text-primary',
}

export default function Badge({ children, variant = 'neutral' }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide ${variants[variant]}`}
    >
      {children}
    </span>
  )
}
