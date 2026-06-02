import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Button from '../components/Button'
import PageContent from '../components/layout/PageContent'
import PageHeader from '../components/layout/PageHeader'
import { listarAuditoriaEnviosUnidade } from '../services/estoqueService'

export default function AuditoriaEnviosView() {
  const location = useLocation()
  const registros = useMemo(
    () => listarAuditoriaEnviosUnidade(),
    [location.key],
  )

  return (
    <PageContent>
      <PageHeader
        title="Auditoria de envios"
        subtitle="Histórico de tudo que o gestor enviou do estoque central para as unidades."
        meta="Cada linha = um envio registrado"
        actions={
          <Button variant="primary" to="/envio-unidade">
            + Novo envio
          </Button>
        }
      />

      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-[var(--shadow-card)]">
        {registros.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-text-muted">
            Nenhum envio registrado ainda.{' '}
            <Link to="/envio-unidade" className="font-semibold text-primary hover:underline">
              Registrar primeiro envio
            </Link>
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-slate-50/80">
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wide text-text-muted">
                    Data / hora
                  </th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wide text-text-muted">
                    Produto
                  </th>
                  <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-text-muted">
                    Quantidade
                  </th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wide text-text-muted">
                    Destino
                  </th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wide text-text-muted">
                    Observação
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {registros.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="whitespace-nowrap px-5 py-3 font-mono text-text-secondary">
                      {item.dataHoraFormatada}
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-text-primary">{item.produtoNome}</p>
                      <p className="text-xs text-text-muted">{item.produtoReferencia}</p>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-right font-mono font-semibold text-text-primary">
                      {item.quantidadeFormatada}
                    </td>
                    <td className="px-5 py-3 font-medium text-text-primary">
                      {item.unidadeNome}
                    </td>
                    <td className="max-w-[200px] truncate px-5 py-3 text-text-muted" title={item.observacao}>
                      {item.observacao}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {registros.length > 0 && (
        <p className="mt-3 text-xs text-text-muted">
          {registros.length} registro(s) · ordenado do mais recente para o mais antigo
        </p>
      )}
    </PageContent>
  )
}
