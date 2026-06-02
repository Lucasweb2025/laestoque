import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import Button from '../components/Button'
import PageContent from '../components/layout/PageContent'
import PageHeader from '../components/layout/PageHeader'
import ProductsTable from '../components/ProductsTable'
import StatCard from '../components/ui/StatCard'
import UnidadesCard from '../components/UnidadesCard'
import { buscarProdutos, obterResumoEstoque } from '../services/estoqueService'

export default function HomeView() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const apenasCriticos = searchParams.get('estoque') === 'critico'
  const [busca, setBusca] = useState('')
  const [versao, setVersao] = useState(0)

  useEffect(() => {
    setVersao((v) => v + 1)
  }, [location.key])

  const totalCatalogo = useMemo(() => buscarProdutos('').length, [versao])

  const produtos = useMemo(() => {
    const lista = buscarProdutos(busca)
    return apenasCriticos ? lista.filter((p) => p.saldo <= 0) : lista
  }, [busca, versao, apenasCriticos])

  const resumo = useMemo(() => obterResumoEstoque(), [versao])

  const dataAtual = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <PageContent>
      <PageHeader
        title="Controle de estoque"
        subtitle="Material chega ao estoque central, é distribuído para as unidades e consumido no serviço."
        meta={`Última sincronização: ${dataAtual} · Ambiente de produção`}
        actions={
          <>
            <Button variant="outline" to="/produtos/novo">
              Novo produto
            </Button>
            <Button variant="outline" to="/inventario">
              Inventário inicial
            </Button>
            <Button variant="entrada" to="/chegada">
              + Registrar chegada
            </Button>
            <Button variant="primary" to="/envio-unidade">
              Envio para unidade
            </Button>
            <Button variant="saida" to="/saida">
              Registrar saída
            </Button>
          </>
        }
      />

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <StatCard
          label="SKUs cadastrados"
          value={resumo.total}
          hint="Total de itens no catálogo"
          accent="primary"
        />
        <StatCard
          label="Disponibilidade"
          value={resumo.comEstoque}
          hint="Itens com saldo positivo"
          trend={resumo.total > 0 ? `${Math.round((resumo.comEstoque / resumo.total) * 100)}%` : undefined}
          accent="success"
        />
        <StatCard
          label="Ruptura de estoque"
          value={resumo.semEstoque}
          hint="Requer reposição imediata"
          accent={resumo.semEstoque > 0 ? 'danger' : 'neutral'}
          action={
            resumo.semEstoque > 0
              ? { label: 'Ver itens críticos →', to: '/?estoque=critico' }
              : undefined
          }
        />
      </div>

      {apenasCriticos && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-950">
          <span>Mostrando apenas produtos com estoque <strong>crítico</strong> (saldo zero).</span>
          <Link to="/" className="font-semibold text-primary hover:underline">
            Ver todos
          </Link>
        </div>
      )}

      <div className="mb-8">
        <ProductsTable
          produtos={produtos}
          totalGeral={totalCatalogo}
          busca={busca}
          onBuscaChange={setBusca}
        />
      </div>

      <UnidadesCard />
    </PageContent>
  )
}
