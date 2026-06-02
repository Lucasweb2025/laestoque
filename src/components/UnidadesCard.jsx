import { Link } from 'react-router-dom'
import { obterResumoEnviosPorUnidade } from '../services/estoqueService'

export default function UnidadesCard() {
  const resumo = obterResumoEnviosPorUnidade()

  return (
    <section className="rounded-lg border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-bold text-title">Envios por unidade</h2>
          <p className="mt-1 text-xs text-text-muted">
            Central → lojas (gestão de compras)
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/auditoria/envios"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Auditoria
          </Link>
          <Link
            to="/relatorio/envios"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Resumo
          </Link>
          <Link
            to="/envio-unidade"
            className="rounded-md border border-primary bg-primary-muted px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10"
          >
            Registrar envio
          </Link>
        </div>
      </div>

      <ul className="mt-5 grid gap-4 md:grid-cols-3">
        {resumo.map((unidade) => (
          <li
            key={unidade.id}
            className="rounded-lg border border-border-subtle bg-slate-50/60 p-4"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-text-muted">
              {unidade.marca}
            </p>
            <p className="mt-0.5 text-sm font-semibold text-text-primary">{unidade.nome}</p>
            <p className="text-xs text-text-muted">{unidade.cidade}</p>
            {unidade.itens.length === 0 ? (
              <p className="mt-3 text-xs text-text-muted">Nenhum envio registrado</p>
            ) : (
              <ul className="mt-3 space-y-1.5 border-t border-border-subtle pt-3">
                {unidade.itens.slice(0, 4).map((item) => (
                  <li
                    key={item.produtoId}
                    className="flex justify-between gap-2 text-xs text-text-muted"
                  >
                    <span className="truncate">{item.nome}</span>
                    <span className="shrink-0 font-mono font-semibold text-text-secondary">
                      {item.totalFormatado}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
