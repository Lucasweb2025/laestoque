import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Button from '../components/Button'
import PageContent from '../components/layout/PageContent'
import PageHeader from '../components/layout/PageHeader'
import { obterResumoEnviosPorUnidade } from '../services/estoqueService'

export default function RelatorioEnviosView() {
  const location = useLocation()
  const resumo = useMemo(
    () => obterResumoEnviosPorUnidade(),
    [location.key],
  )

  return (
    <PageContent>
      <PageHeader
        title="Material enviado por unidade"
        subtitle="Visão consolidada para gestão de compras — tudo que saiu do estoque central para cada loja."
        meta="Relatório · Estoque central → unidades"
        actions={
          <>
            <Button variant="outline" to="/auditoria?tipo=envio">
              Ver auditoria
            </Button>
            <Button variant="primary" to="/envio-unidade">
              + Novo envio
            </Button>
          </>
        }
      />

      <div className="mb-6 rounded-lg border border-primary/20 bg-primary-muted px-4 py-3 text-sm text-primary">
        <strong>Fluxo:</strong> mercadoria chega com <Link to="/chegada" className="underline">Registrar chegada</Link>
        {' → '}fica no estoque central{' → '}
        <Link to="/envio-unidade" className="underline">Envio para unidade</Link>
        {' → '}aparece neste relatório.
      </div>

      <div className="space-y-6">
        {resumo.map((unidade) => (
          <section
            key={unidade.id}
            className="overflow-hidden rounded-lg border border-border bg-card shadow-[var(--shadow-card)]"
          >
            <header className="border-b border-border bg-slate-50/80 px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-text-muted">
                    {unidade.marca}
                  </p>
                  <h2 className="text-lg font-bold text-title">{unidade.nome}</h2>
                </div>
                <p className="text-sm text-text-muted">
                  {unidade.quantidadeEnvios} envio(s) registrado(s)
                </p>
              </div>
            </header>

            {unidade.itens.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-text-muted">
                Nenhum material enviado ainda para esta unidade.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wide text-text-muted">
                        Produto
                      </th>
                      <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wide text-text-muted">
                        Referência
                      </th>
                      <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-text-muted">
                        Total enviado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {unidade.itens.map((item) => (
                      <tr key={item.produtoId} className="hover:bg-slate-50/50">
                        <td className="px-5 py-3 font-medium text-text-primary">
                          {item.nome}
                        </td>
                        <td className="px-5 py-3 text-text-muted">{item.referencia}</td>
                        <td className="px-5 py-3 text-right font-mono font-semibold text-text-primary">
                          {item.totalFormatado}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}
      </div>
    </PageContent>
  )
}
