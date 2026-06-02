import { Link } from 'react-router-dom'

export default function SolicitarReposicaoButton({ produtoId, compact = false, className = '' }) {
  const rotulo = compact ? 'Solicitar' : 'Solicitar reposição'

  return (
    <Link
      to={`/solicitacao-reposicao?produto=${encodeURIComponent(produtoId)}`}
      title={rotulo}
      className={`inline-flex max-w-full shrink-0 items-center justify-center gap-1 rounded border border-primary/25 bg-card px-2 py-1 text-[11px] font-semibold leading-tight text-primary shadow-[var(--shadow-xs)] transition-colors hover:border-primary/50 hover:bg-primary-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 sm:gap-1.5 sm:px-2.5 sm:py-1.5 sm:text-xs ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <svg
        className="h-3 w-3 shrink-0 opacity-80 sm:h-3.5 sm:w-3.5"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden
      >
        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v2H7V5zm0 4h6v2H7V9zm0 4h4v2H7v-2z" />
      </svg>
      <span className="truncate">{rotulo}</span>
    </Link>
  )
}
