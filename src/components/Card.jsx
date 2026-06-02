export default function Card({ children, className = '', padding = true }) {
  return (
    <div
      className={`rounded-xl border border-border bg-card shadow-[var(--shadow-card)] ${
        padding ? 'p-5' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
