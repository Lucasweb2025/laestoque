import { useLocation } from 'react-router-dom'
import { UNIDADE_CENTRAL } from '../../config/plataforma'

const rotas = {
  '/': ['Início', 'Supply Chain', 'Estoque', 'Visão geral'],
  '/chegada': ['Início', 'Supply Chain', 'Estoque', 'Entrada de material'],
  '/saida': ['Início', 'Supply Chain', 'Estoque', 'Saída / consumo'],
  '/produtos/novo': ['Início', 'Supply Chain', 'Estoque', 'Novo produto'],
  '/inventario': ['Início', 'Supply Chain', 'Estoque', 'Inventário inicial'],
  '/auditoria': ['Início', 'Supply Chain', 'Estoque', 'Auditoria geral'],
  '/envio-unidade': ['Início', 'Supply Chain', 'Estoque', 'Envio para unidade'],
  '/relatorio/envios': ['Início', 'Supply Chain', 'Estoque', 'Envios por unidade'],
  '/produtos/localizacao': ['Início', 'Supply Chain', 'Estoque', 'Localização no estoque'],
  '/solicitacao-reposicao': ['Início', 'Supply Chain', 'Estoque', 'Solicitação de reposição'],
  '/fornecedores': ['Início', 'Supply Chain', 'Estoque', 'Fornecedores'],
}

export default function TopBar() {
  const { pathname } = useLocation()
  const trilha = rotas[pathname] ?? rotas['/']

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-border bg-topbar px-6 shadow-[var(--shadow-topbar)]">
      <nav aria-label="Navegação estrutural" className="flex min-w-0 items-center gap-1.5 text-sm">
        {trilha.map((item, i) => {
          const ultimo = i === trilha.length - 1
          return (
            <span key={`${item}-${i}`} className="flex items-center gap-1.5">
              {i > 0 && (
                <span className="text-border select-none" aria-hidden="true">
                  /
                </span>
              )}
              <span
                className={
                  ultimo
                    ? 'truncate font-semibold text-title'
                    : 'truncate text-text-muted'
                }
              >
                {item}
              </span>
            </span>
          )
        })}
      </nav>

      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-md border border-border bg-slate-50 px-3 py-1.5 sm:flex">
          <span className="h-2 w-2 rounded-full bg-action-entrada" aria-hidden="true" />
          <span className="text-xs font-semibold text-text-secondary">{UNIDADE_CENTRAL.nome}</span>
          <span className="text-border">|</span>
          <span className="text-xs text-text-muted">Estoque {UNIDADE_CENTRAL.filial}</span>
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-text-muted transition-colors hover:bg-slate-100 hover:text-text-primary"
          aria-label="Ajuda"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
            />
          </svg>
        </button>

        <button
          type="button"
          className="relative rounded-md p-2 text-text-muted transition-colors hover:bg-slate-100 hover:text-text-primary"
          aria-label="Notificações"
        >
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-action-saida ring-2 ring-white" />
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
            />
          </svg>
        </button>

        <div className="ml-1 hidden h-8 w-px bg-border sm:block" />

        <div className="hidden items-center gap-2 pl-1 sm:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-title text-xs font-bold text-white">
            LS
          </div>
        </div>
      </div>
    </header>
  )
}
