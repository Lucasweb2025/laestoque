import { useEffect } from 'react'
import { buscarFornecedorPorId } from '../services/fornecedorService'

export default function FornecedorDetalheModal({ fornecedor: fornecedorProp, fornecedorId, onFechar }) {
  const fornecedor =
    fornecedorProp ?? (fornecedorId ? buscarFornecedorPorId(fornecedorId) : null)

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onFechar()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onFechar])

  if (!fornecedor) return null

  const telefoneHref = fornecedor.telefone?.replace(/\D/g, '')
  const telLink = telefoneHref ? `tel:+55${telefoneHref}` : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fornecedor-modal-titulo"
      onClick={onFechar}
    >
      <div
        className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-text-muted">
              Fornecedor
            </p>
            <h2
              id="fornecedor-modal-titulo"
              className="text-lg font-semibold text-text-primary"
            >
              {fornecedor.nome}
            </h2>
          </div>
          <button
            type="button"
            onClick={onFechar}
            className="rounded-lg p-1.5 text-text-muted hover:bg-slate-100 hover:text-text-primary"
            aria-label="Fechar"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <dl className="space-y-4 text-sm">
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-wide text-text-muted">
              Telefone
            </dt>
            <dd className="mt-1 font-medium text-text-primary">
              {fornecedor.telefone ? (
                telLink ? (
                  <a href={telLink} className="text-primary hover:underline">
                    {fornecedor.telefone}
                  </a>
                ) : (
                  fornecedor.telefone
                )
              ) : (
                <span className="text-text-muted">—</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-wide text-text-muted">
              E-mail
            </dt>
            <dd className="mt-1 font-medium text-text-primary">
              {fornecedor.email ? (
                <a
                  href={`mailto:${fornecedor.email}`}
                  className="text-primary hover:underline"
                >
                  {fornecedor.email}
                </a>
              ) : (
                <span className="text-text-muted">—</span>
              )}
            </dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={onFechar}
          className="mt-6 w-full rounded-lg border border-border py-2.5 text-sm font-semibold text-text-secondary hover:bg-slate-50"
        >
          Fechar
        </button>
      </div>
    </div>
  )
}
