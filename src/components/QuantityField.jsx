import { obterConfigCategoria } from '../domain/estoque'

export default function QuantityField({
  valor,
  onChange,
  categoria,
  label = 'Quantidade',
  saldoAtual,
}) {
  const { unidade, permiteDecimal } = obterConfigCategoria(categoria)
  const dica = permiteDecimal
    ? `Use vírgula para decimais (ex: 1,5 ${unidade})`
    : `Somente números inteiros (${unidade})`

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-text-primary">{label}</label>
      <input
        type="text"
        inputMode={permiteDecimal ? 'decimal' : 'numeric'}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`0 ${unidade}`}
        className="w-full rounded-lg border border-border bg-card px-4 py-3 text-xl font-semibold text-text-primary shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        autoComplete="off"
      />
      <p className="mt-2 text-xs text-text-muted">{dica}</p>
      {saldoAtual != null && (
        <p className="mt-1 text-xs text-text-muted">
          Disponível: {saldoAtual.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}{' '}
          {unidade}
        </p>
      )}
    </div>
  )
}
