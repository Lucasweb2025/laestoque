import { formatarQuantidade } from '../domain/estoque'
import ProductThumb from './ProductThumb'
import Badge from './ui/Badge'

export default function ProductListItem({ produto, onSelect, destaqueSemEstoque = true }) {
  const semEstoque = produto.saldo <= 0

  return (
    <button
      type="button"
      onClick={() => onSelect(produto)}
      className="flex w-full items-center gap-4 rounded-xl border border-border bg-card p-4 text-left shadow-[var(--shadow-card)] transition-all duration-150 hover:border-slate-300 hover:shadow-[var(--shadow-card-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
    >
      <ProductThumb produto={produto} />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-text-primary">{produto.nome}</p>
        <p className="font-mono text-xs text-text-muted">{produto.referencia}</p>
        {produto.localizacao && (
          <p className="mt-1 text-xs text-text-muted">End. {produto.localizacao}</p>
        )}
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        {destaqueSemEstoque && semEstoque && (
          <Badge variant="danger">Sem estoque</Badge>
        )}
        <p
          className={`text-sm font-bold tabular-nums ${
            semEstoque ? 'text-danger-text' : 'text-text-primary'
          }`}
        >
          {formatarQuantidade(produto.saldo, produto.categoria)}
        </p>
      </div>
    </button>
  )
}
