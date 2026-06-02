import { Link } from 'react-router-dom'
import { formatarSaldoTabela, obterConfigCategoria } from '../domain/estoque'
import SolicitarReposicaoButton from './SolicitarReposicaoButton'
import ProductThumb from './ProductThumb'
import Badge from './ui/Badge'
import EmptyState from './ui/EmptyState'

const STICKY_SHADOW = 'shadow-[-8px_0_16px_-12px_rgba(15,23,42,0.15)]'

export default function ProductsTable({ produtos, busca, onBuscaChange, totalGeral }) {
  const total = totalGeral ?? produtos.length

  return (
    <section className="rounded-lg border border-border bg-card shadow-[var(--shadow-card)]">
      <div className="border-b border-border bg-gradient-to-r from-slate-50 to-white px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-base font-bold tracking-tight text-title">
                Registro de produtos
              </h2>
              <span className="rounded-full border border-primary/20 bg-primary-muted px-3 py-0.5 text-xs font-bold text-primary">
                {produtos.length} de {total} itens
              </span>
            </div>
            <p className="mt-1.5 text-sm text-text-secondary">
              Estoque central · LA Custom — catálogo completo com saldo, localização e status
            </p>
          </div>
          {onBuscaChange && (
            <div className="w-full lg:max-w-md">
              <SearchInline valor={busca} onChange={onBuscaChange} />
            </div>
          )}
        </div>
      </div>

      {produtos.length === 0 ? (
        <EmptyState
          title="Nenhum registro localizado"
          description="Ajuste os filtros de busca ou cadastre uma nova entrada de material."
        />
      ) : (
        <>
          <p className="border-b border-border-subtle bg-slate-50/80 px-4 py-2 text-center text-[11px] text-text-muted xl:hidden">
            Deslize horizontalmente para ver status e reposição →
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] table-fixed border-collapse text-left">
              <colgroup>
                <col className="w-[56px]" />
                <col className="w-[88px]" />
                <col />
                <col className="w-[108px]" />
                <col className="w-[96px]" />
                <col className="w-[80px]" />
                <col className="w-[140px]" />
                <col className="w-[108px]" />
                <col className="w-[116px]" />
              </colgroup>
              <thead>
                <tr className="border-b border-border bg-slate-100/90">
                  <Th>Código</Th>
                  <Th>Referência</Th>
                  <Th>Descrição</Th>
                  <Th>Grupo</Th>
                  <Th>Marca</Th>
                  <Th align="right">Saldo</Th>
                  <Th>Localização</Th>
                  <Th className={`${STICKY_SHADOW} sticky right-[116px] z-20 bg-slate-100`}>
                    Status
                  </Th>
                  <Th className={`${STICKY_SHADOW} sticky right-0 z-20 bg-slate-100`}>
                    Reposição
                  </Th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((produto, i) => {
                  const semEstoque = produto.saldo <= 0
                  const { label: grupo, unidade } = obterConfigCategoria(produto.categoria)
                  const marca = produto.marca?.trim() || 'Não informada'
                  const rowBg = semEstoque
                    ? 'bg-danger-bg/30'
                    : i % 2 === 1
                      ? 'bg-slate-50/50'
                      : 'bg-card'
                  const stickyTd = `${rowBg} ${STICKY_SHADOW} sticky z-10`

                  return (
                    <tr
                      key={produto.id}
                      className={`border-b border-border-subtle transition-colors hover:bg-primary-muted/25 ${rowBg}`}
                    >
                      <td className="px-3 py-3.5 font-mono text-xs font-bold text-text-secondary sm:px-4">
                        {produto.id}
                      </td>
                      <td className="truncate px-3 py-3.5 font-mono text-xs font-medium text-text-muted sm:px-4">
                        {produto.referencia}
                      </td>
                      <td className="px-3 py-3.5 sm:px-4">
                        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                          <ProductThumb produto={produto} tamanho="sm" />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-text-primary">
                              {produto.nome}
                            </p>
                            <p className="truncate text-xs text-text-muted">SKU {produto.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 sm:px-4">
                        <span
                          className="block truncate rounded border border-border-subtle bg-slate-50 px-1.5 py-0.5 text-[11px] font-medium text-text-secondary"
                          title={grupo}
                        >
                          {grupo}
                        </span>
                      </td>
                      <td
                        className={`truncate px-3 py-3.5 text-sm sm:px-4 ${
                          produto.marca?.trim()
                            ? 'font-medium text-text-primary'
                            : 'italic text-text-muted'
                        }`}
                        title={marca}
                      >
                        {marca}
                      </td>
                      <td
                        className={`whitespace-nowrap px-3 py-3.5 text-right font-mono text-sm font-bold tabular-nums sm:px-4 ${
                          semEstoque ? 'text-danger-text' : 'text-text-primary'
                        }`}
                      >
                        {formatarSaldoTabela(produto.saldo, produto.categoria)}{' '}
                        <span className="text-xs font-semibold uppercase text-text-muted">
                          {unidade}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 sm:px-4">
                        <Link
                          to={`/produtos/localizacao?produto=${encodeURIComponent(produto.id)}`}
                          className="group block min-w-0"
                          title="Clique para definir ou alterar a localização"
                        >
                          <span className="block truncate text-sm text-text-secondary group-hover:text-primary">
                            {produto.localizacao?.trim() || (
                              <span className="italic text-text-muted">Definir endereço</span>
                            )}
                          </span>
                          <span className="mt-0.5 hidden text-[10px] font-semibold text-primary group-hover:inline sm:inline">
                            Editar →
                          </span>
                        </Link>
                      </td>
                      <td className={`${stickyTd} right-[116px] px-3 py-3.5 sm:px-4`}>
                        <Badge variant={semEstoque ? 'danger' : 'success'}>
                          {semEstoque ? 'Em ruptura' : 'Em estoque'}
                        </Badge>
                      </td>
                      <td className={`${stickyTd} right-0 px-3 py-3.5 sm:px-4`}>
                        {semEstoque ? (
                          <SolicitarReposicaoButton produtoId={produto.id} compact />
                        ) : (
                          <span className="whitespace-nowrap text-xs font-medium text-success-text">
                            Em dia
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <footer className="flex flex-col gap-3 border-t border-border bg-slate-50 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-text-muted">
          Exibindo{' '}
          <strong className="font-semibold text-text-primary">{produtos.length}</strong> de{' '}
          <strong className="font-semibold text-text-primary">{total}</strong> registros no
          estoque central
        </p>
        <p className="text-xs text-text-muted">
          Saldo em m, L ou un · colunas Status e Reposição fixas à direita
        </p>
      </footer>
    </section>
  )
}

function Th({ children, align = 'left', className = '' }) {
  return (
    <th
      className={`px-3 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-text-muted sm:px-4 ${
        align === 'right' ? 'text-right' : 'text-left'
      } ${className}`}
    >
      {children}
    </th>
  )
}

function SearchInline({ valor, onChange }) {
  return (
    <div className="relative">
      <svg
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
      <input
        type="search"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Filtrar por código, descrição ou referência..."
        className="w-full rounded-md border border-border bg-card py-2.5 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
      />
    </div>
  )
}
