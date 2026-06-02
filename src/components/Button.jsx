import { Link } from 'react-router-dom'

const variantClass = {
  primary:
    'border border-primary bg-primary text-white hover:bg-primary-hover focus-visible:ring-primary',
  entrada:
    'border border-action-entrada bg-action-entrada text-white hover:bg-action-entrada-hover focus-visible:ring-action-entrada',
  saida:
    'border border-action-saida bg-action-saida text-white hover:bg-action-saida-hover focus-visible:ring-action-saida',
  outline:
    'border border-border bg-card text-text-secondary hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-400',
  ghost: 'text-text-muted hover:bg-slate-100 hover:text-text-primary',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  type = 'button',
  disabled = false,
  onClick,
  className = '',
}) {
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-[13px]',
    lg: 'px-5 py-2.5 text-sm',
  }

  const base =
    'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

  const classes = `${base} ${sizes[size]} ${variantClass[variant]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={classes}>
      {children}
    </button>
  )
}
