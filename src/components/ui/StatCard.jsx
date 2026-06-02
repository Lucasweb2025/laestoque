import { Link } from 'react-router-dom'

export default function StatCard({ label, value, hint, trend, accent = 'primary', action }) {
  const borders = {
    primary: 'border-l-primary',
    success: 'border-l-action-entrada',
    danger: 'border-l-action-saida',
    neutral: 'border-l-slate-400',
  }

  return (
    <div
      className={`rounded-lg border border-border bg-card px-5 py-4 shadow-[var(--shadow-card)] border-l-[3px] ${borders[accent]}`}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted">
        {label}
      </p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <p className="text-3xl font-bold tabular-nums tracking-tight text-title">{value}</p>
        {trend && (
          <span className="mb-1 text-xs font-semibold text-success-text">{trend}</span>
        )}
      </div>
      {hint && <p className="mt-1.5 text-xs text-text-muted">{hint}</p>}
      {action && (
        <Link
          to={action.to}
          className="mt-2 inline-block text-xs font-semibold text-primary hover:underline"
        >
          {action.label}
        </Link>
      )}
    </div>
  )
}
