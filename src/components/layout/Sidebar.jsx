import { NavLink } from 'react-router-dom'
import { PLATAFORMA } from '../../config/plataforma'

const navLinkClass = ({ isActive }) =>
  [
    'relative flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] font-medium transition-colors',
    isActive
      ? 'bg-sidebar-hover text-sidebar-text-active before:absolute before:left-0 before:top-1/2 before:h-5 before:w-0.5 before:-translate-y-1/2 before:rounded-full before:bg-sidebar-accent before:content-[""]'
      : 'text-sidebar-text hover:bg-sidebar-hover/60 hover:text-sidebar-text-active',
  ].join(' ')

function NavIcon({ children }) {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-sidebar-text">
      {children}
    </span>
  )
}

export default function Sidebar() {
  return (
    <aside className="flex w-[15.5rem] shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="border-b border-sidebar-border px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-title shadow-lg">
            <span className="text-xs font-bold tracking-wider text-white">LAC</span>
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight text-white">LA Custom</p>
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-sidebar-text">
              Módulo {PLATAFORMA.moduloId}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
          Módulos
        </p>
        <p className="mb-1.5 px-3 text-[11px] font-semibold text-slate-500">Supply Chain</p>

        <div className="mb-6 space-y-0.5">
          <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-sidebar-accent">
            Estoque
          </p>
          <NavLink to="/" end className={navLinkClass}>
            <NavIcon>
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm8 0a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zM3 12a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm8 0a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3z" />
              </svg>
            </NavIcon>
            Visão geral
          </NavLink>
          <NavLink to="/chegada" className={navLinkClass}>
            <NavIcon>
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </NavIcon>
            Entrada de material
          </NavLink>
          <NavLink to="/envio-unidade" className={navLinkClass}>
            <NavIcon>
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 000 2h1.22l.305 1.222a1 1 0 00.97.778H15a1 1 0 00.97-.778L16.22 6H5a1 1 0 00-1 1v6.382a1 1 0 00.553.894l4 2A1 1 0 0010 16V9H7a1 1 0 100-2h6.586L13.414 5H3z" />
              </svg>
            </NavIcon>
            Envio para unidade
          </NavLink>
          <NavLink to="/relatorio/envios" className={navLinkClass}>
            <NavIcon>
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </NavIcon>
            Envios por unidade
          </NavLink>
          <NavLink to="/auditoria" className={navLinkClass}>
            <NavIcon>
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 100-2 1 1 0 000 2zm2-3a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zm-2 5a1 1 0 100-2 1 1 0 000 2zm5-1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
              </svg>
            </NavIcon>
            Auditoria geral
          </NavLink>
          <NavLink to="/saida" className={navLinkClass}>
            <NavIcon>
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M3 10a1 1 0 011-1h10.586l-2.293-2.293a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </NavIcon>
            Saída / consumo
          </NavLink>
        </div>

        <p className="mb-1.5 px-3 text-[11px] font-semibold text-slate-500">Configuração</p>
        <div className="mb-6 space-y-0.5">
          <NavLink to="/produtos/novo" className={navLinkClass}>
            <NavIcon>
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M10 5a3 3 0 110 6 3 3 0 010-6zM3 15a4 4 0 014-4h6a4 4 0 014 4v1H3v-1z" />
              </svg>
            </NavIcon>
            Novo produto
          </NavLink>
          <NavLink to="/inventario" className={navLinkClass}>
            <NavIcon>
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a1 1 0 011.414 0l.707.707a1 1 0 010 1.414l-4.9 4.9H10v-2.121z" clipRule="evenodd" />
              </svg>
            </NavIcon>
            Inventário inicial
          </NavLink>
          <NavLink to="/produtos/localizacao" className={navLinkClass}>
            <NavIcon>
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </NavIcon>
            Localização no estoque
          </NavLink>
          <NavLink to="/fornecedores" className={navLinkClass}>
            <NavIcon>
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </NavIcon>
            Fornecedores
          </NavLink>
        </div>
      </nav>

      <div className="border-t border-sidebar-border px-4 py-4">
        <div className="mb-3 flex items-center gap-3 rounded-lg border border-sidebar-border bg-sidebar-elevated p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-[10px] font-bold text-white">
            LS
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">Lucas Santos</p>
            <p className="text-[10px] text-sidebar-text">Administrador global</p>
          </div>
        </div>
        <button
          type="button"
          className="w-full rounded-md border border-sidebar-border py-2 text-xs font-semibold text-sidebar-text transition-colors hover:bg-sidebar-hover hover:text-white"
        >
          Encerrar sessão
        </button>
        <p className="mt-3 text-center text-[10px] text-slate-600">
          Módulo estoque · v1.0.0
        </p>
      </div>
    </aside>
  )
}
