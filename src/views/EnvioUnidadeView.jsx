import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AlertMessage from '../components/AlertMessage'
import Button from '../components/Button'
import Card from '../components/Card'
import FormField, { inputClassName } from '../components/FormField'
import PageContent from '../components/layout/PageContent'
import PageHeader from '../components/layout/PageHeader'
import ProductListItem from '../components/ProductListItem'
import ProductThumb from '../components/ProductThumb'
import SearchField from '../components/SearchField'
import { unidadesOperacionais } from '../data/unidades'
import { formatarQuantidade, interpretarQuantidade } from '../domain/estoque'
import { buscarProdutos, registrarEnvioParaUnidade } from '../services/estoqueService'

const PASSOS = { unidade: 1, produto: 2, quantidade: 3 }

export default function EnvioUnidadeView() {
  const navigate = useNavigate()
  const [passo, setPasso] = useState(PASSOS.unidade)
  const [unidadeId, setUnidadeId] = useState('')
  const [busca, setBusca] = useState('')
  const [produtoSelecionado, setProdutoSelecionado] = useState(null)
  const [quantidadeTexto, setQuantidadeTexto] = useState('')
  const [observacao, setObservacao] = useState('')
  const [alerta, setAlerta] = useState(null)
  const [salvando, setSalvando] = useState(false)

  const produtos = useMemo(() => buscarProdutos(busca), [busca])
  const unidadeAtual = unidadesOperacionais.find((u) => u.id === unidadeId)

  function selecionarProduto(produto) {
    setAlerta(null)
    if (produto.saldo <= 0) {
      setAlerta({ tipo: 'erro', mensagem: 'Saldo insuficiente no estoque central.' })
      return
    }
    setProdutoSelecionado(produto)
    setQuantidadeTexto('')
    setPasso(PASSOS.quantidade)
  }

  function confirmarEnvio(e) {
    e.preventDefault()
    setAlerta(null)

    const quantidade = interpretarQuantidade(
      quantidadeTexto,
      produtoSelecionado.categoria,
    )

    if (quantidade == null) {
      setAlerta({ tipo: 'erro', mensagem: 'Informe uma quantidade válida.' })
      return
    }

    setSalvando(true)

    try {
      const resultado = registrarEnvioParaUnidade({
        unidadeId,
        produtoId: produtoSelecionado.id,
        quantidade,
        observacao,
      })

      setAlerta({
        tipo: 'sucesso',
        mensagem: `Enviado para ${resultado.unidade.nome}: ${formatarQuantidade(
          quantidade,
          produtoSelecionado.categoria,
        )} de ${produtoSelecionado.nome}. Saldo central: ${formatarQuantidade(
          resultado.produto.saldo,
          resultado.produto.categoria,
        )}.`,
      })

      setTimeout(() => navigate('/auditoria/envios'), 2000)
    } catch (erro) {
      setAlerta({
        tipo: 'erro',
        mensagem: erro.message ?? 'Não foi possível registrar o envio.',
      })
    } finally {
      setSalvando(false)
    }
  }

  if (passo === PASSOS.quantidade && produtoSelecionado && unidadeAtual) {
    return (
      <PageContent narrow>
        <PageHeader
          title="Envio para unidade"
          subtitle={`Destino: ${unidadeAtual.nome}`}
          meta="Baixa no estoque central · distribuição"
        />

        <Card>
          <form onSubmit={confirmarEnvio} className="space-y-5">
            <button
              type="button"
              onClick={() => {
                setPasso(PASSOS.produto)
                setProdutoSelecionado(null)
                setAlerta(null)
              }}
              className="text-sm font-medium text-text-muted hover:text-primary"
            >
              ← Escolher outro produto
            </button>

            <div className="flex items-center gap-4 rounded-lg border border-border-subtle bg-slate-50/80 p-4">
              <ProductThumb produto={produtoSelecionado} tamanho="lg" />
              <div>
                <p className="font-semibold text-text-primary">{produtoSelecionado.nome}</p>
                <p className="text-sm text-text-muted">
                  Disponível no central:{' '}
                  {formatarQuantidade(
                    produtoSelecionado.saldo,
                    produtoSelecionado.categoria,
                  )}
                </p>
              </div>
            </div>

            <FormField label="Quantidade a enviar" required>
              <input
                className={`${inputClassName} text-lg font-semibold`}
                value={quantidadeTexto}
                onChange={(e) => setQuantidadeTexto(e.target.value)}
                autoFocus
              />
            </FormField>

            <FormField label="Observação">
              <textarea
                className={`${inputClassName} min-h-[72px]`}
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Ex: pedido semanal, urgente..."
                rows={2}
              />
            </FormField>

            {alerta && <AlertMessage tipo={alerta.tipo} mensagem={alerta.mensagem} />}

            <Button
              type="submit"
              variant="primary"
              disabled={salvando || alerta?.tipo === 'sucesso'}
              className="w-full"
            >
              {salvando ? 'Registrando...' : 'Confirmar envio para unidade'}
            </Button>
          </form>
        </Card>
      </PageContent>
    )
  }

  if (passo === PASSOS.produto && unidadeAtual) {
    return (
      <PageContent narrow>
        <PageHeader
          title="Envio para unidade"
          subtitle={`Destino: ${unidadeAtual.nome}`}
          meta="Selecione o material no estoque central"
        />

        <div className="space-y-4">
          <button
            type="button"
            onClick={() => {
              setPasso(PASSOS.unidade)
              setAlerta(null)
            }}
            className="text-sm font-medium text-text-muted hover:text-primary"
          >
            ← Alterar unidade
          </button>

          <SearchField valor={busca} onChange={setBusca} />
          {alerta && <AlertMessage tipo={alerta.tipo} mensagem={alerta.mensagem} />}

          <ul className="space-y-2">
            {produtos.map((produto) => (
              <li key={produto.id}>
                <ProductListItem produto={produto} onSelect={selecionarProduto} />
              </li>
            ))}
          </ul>
        </div>
      </PageContent>
    )
  }

  return (
    <PageContent narrow>
      <PageHeader
        title="Envio para unidade"
        subtitle="O material já está no estoque central. Registre o que será distribuído para cada loja."
        meta="Fluxo: Chegada → Estoque central → Envio para unidade"
      />

      <div className="grid gap-3">
        {unidadesOperacionais.map((unidade) => (
          <button
            key={unidade.id}
            type="button"
            onClick={() => {
              setUnidadeId(unidade.id)
              setPasso(PASSOS.produto)
              setAlerta(null)
            }}
            className="rounded-lg border border-border bg-card p-5 text-left shadow-[var(--shadow-card)] transition-all hover:border-primary hover:shadow-[var(--shadow-card-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-text-muted">
              {unidade.marca}
            </p>
            <p className="mt-1 text-lg font-semibold text-title">{unidade.nome}</p>
            <p className="mt-0.5 text-sm text-text-muted">{unidade.cidade}</p>
          </button>
        ))}
      </div>
    </PageContent>
  )
}
