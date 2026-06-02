import { useMemo, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import FornecedorDetalheModal from '../components/FornecedorDetalheModal'
import PageContent from '../components/layout/PageContent'
import PageHeader from '../components/layout/PageHeader'
import Badge from '../components/ui/Badge'
import { FILTROS_AUDITORIA, listarAuditoriaGeral } from '../services/estoqueService'

const BADGE_POR_TIPO = {
  entrada: 'success',
  saida: 'danger',
  envio_unidade: 'primary',
  estoque_atual: 'warning',
  pedido_reposicao: 'warning',
  localizacao: 'neutral',
}

export default function AuditoriaGeralView() {
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const filtro = searchParams.get('tipo') ?? 'todos'
  const [fornecedorModalId, setFornecedorModalId] = useState(null)

  const registros = useMemo(
    () => listarAuditoriaGeral(filtro),
    [location.key, filtro],
  )

  function selecionarFiltro(chave) {
    if (chave === 'todos') {
      setSearchParams({})
    } else {
      setSearchParams({ tipo: chave })
    }
  }

  return (
    <PageContent>
      <PageHeader
        title="Auditoria geral"
        subtitle="Histórico unificado de chegadas, saídas, envios para unidades e outros movimentos do estoque central."
        meta="Cada linha = um registro no sistema"
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {Object.entries(FILTROS_AUDITORIA).map(([chave, { label }]) => {
          const ativo = filtro === chave || (filtro === 'todos' && chave === 'todos')
          return (
            <button
              key={chave}
              type="button"
              onClick={() => selecionarFiltro(chave)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                ativo
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-card text-text-secondary hover:border-primary/40'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-[var(--shadow-card)]">
        {registros.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-text-muted">
            Nenhum registro para este filtro.{' '}
            <Link to="/chegada" className="font-semibold text-primary hover:underline">
              Registrar chegada
            </Link>
            {' · '}
            <Link to="/saida" className="font-semibold text-primary hover:underline">
              Registrar saída
            </Link>
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-slate-50/80">
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wide text-text-muted">
                    Data / hora
                  </th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wide text-text-muted">
                    Tipo
                  </th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wide text-text-muted">
                    Produto
                  </th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wide text-text-muted">
                    Quantidade
                  </th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wide text-text-muted">
                    Detalhe
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
                      <Badge variant={BADGE_POR_TIPO[item.tipo] ?? 'neutral'}>
                        {item.tipoLabel}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-text-primary">{item.produtoNome}</p>
                      <p className="text-xs text-text-muted">{item.produtoReferencia}</p>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 font-mono text-text-primary">
                      {item.quantidadeColuna}
                    </td>
                    <td className="max-w-[200px] px-5 py-3 text-text-secondary">
                      {item.fornecedorId ? (
                        <button
                          type="button"
                          onClick={() => setFornecedorModalId(item.fornecedorId)}
                          className="truncate font-semibold text-primary hover:underline"
                          title="Ver telefone e e-mail do fornecedor"
                        >
                          {item.detalhe}
                        </button>
                      ) : (
                        <span className="truncate" title={item.detalhe}>
                          {item.detalhe}
                        </span>
                      )}
                    </td>
                    <td className="max-w-[180px] truncate px-5 py-3 text-text-muted" title={item.observacao}>
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
          {registros.length} registro(s) · {FILTROS_AUDITORIA[filtro]?.label ?? 'Todos'} · do mais
          recente ao mais antigo
        </p>
      )}

      {fornecedorModalId && (
        <FornecedorDetalheModal
          fornecedorId={fornecedorModalId}
          onFechar={() => setFornecedorModalId(null)}
        />
      )}
    </PageContent>
  )
}
