import { Link } from 'react-router-dom'

export default function BackLink({ to = '/', children = 'Voltar aos produtos' }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center text-sm font-medium text-text-muted transition-colors hover:text-primary"
    >
      ← {children}
    </Link>
  )
}
