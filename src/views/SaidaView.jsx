import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AlertMessage from '../components/AlertMessage'
import BackLink from '../components/BackLink'
import Button from '../components/Button'
import Card from '../components/Card'
import PageContent from '../components/layout/PageContent'
import PageHeader from '../components/layout/PageHeader'
import ProductListItem from '../components/ProductListItem'
import ProductThumb from '../components/ProductThumb'
import QuantityField from '../components/QuantityField'
import SearchField from '../components/SearchField'
import { formatarQuantidade, interpretarQuantidade } from '../domain/estoque'
import { buscarProdutos, registrarSaidaDeMaterial } from '../services/estoqueService'

const PASSOS = { veiculo: 1, produto: 2, quantidade: 3 }

export default function SaidaView() {
  const navigate = useNavigate()
  const [passo, setPasso] = useState(PASSOS.veiculo)
  const [veiculo, setVeiculo] = useState('')
  const [busca, setBusca] = useState('')
  const [produtoSelecionado, setProdutoSelecionado] = useState(null)
  const [quantidadeTexto, setQuantidadeTexto] = useState('')
  const [alerta, setAlerta] = useState(null)
  const [salvando, setSalvando] = useState(false)

  const produtos = useMemo(() => buscarProdutos(busca), [busca])

  function avancarVeiculo() {
    setAlerta(null)
    if (!veiculo.trim()) {
      setAlerta({ tipo: 'erro', mensagem: 'Informe o veículo ou a placa.' })
      return
    }
    setPasso(PASSOS.produto)
  }

  function selecionarProduto(produto) {
    setAlerta(null)
    if (produto.saldo <= 0) {
      setAlerta({ tipo: 'erro', mensagem: 'Saldo insuficiente.' })
      return
    }
    setProdutoSelecionado(produto)
    setQuantidadeTexto('')
    setPasso(PASSOS.quantidade)
  }

  function confirmarSaida() {
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
      const atualizado = registrarSaidaDeMaterial({
        produtoId: produtoSelecionado.id,
        quantidade,
        veiculo: veiculo.trim(),
      })

      setAlerta({
        tipo: 'sucesso',
        mensagem: `Material retirado! Saldo restante: ${formatarQuantidade(
          atualizado.saldo,
          atualizado.categoria,
        )}`,
      })

      setTimeout(() => navigate('/'), 1800)
    } catch (erro) {
      setAlerta({
        tipo: 'erro',
        mensagem: erro.message ?? 'Não foi possível registrar a saída.',
      })
    } finally {
      setSalvando(false)
    }
  }

  if (passo === PASSOS.quantidade && produtoSelecionado) {
    return (
      <PageContent narrow>
        <PageHeader
          title="Saída de material"
          subtitle={`Destino: ${veiculo.trim()}`}
          meta="Tipo de movimentação: Saída / consumo"
        />

        <div className="space-y-5">
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

          <Card className="flex items-center gap-4">
            <ProductThumb produto={produtoSelecionado} tamanho="lg" />
            <div>
              <p className="font-semibold text-text-primary">{produtoSelecionado.nome}</p>
              <p className="text-sm text-text-muted">
                Disponível:{' '}
                {formatarQuantidade(
                  produtoSelecionado.saldo,
                  produtoSelecionado.categoria,
                )}
              </p>
            </div>
          </Card>

          <QuantityField
            valor={quantidadeTexto}
            onChange={setQuantidadeTexto}
            categoria={produtoSelecionado.categoria}
            label="Quanto foi usado?"
            saldoAtual={produtoSelecionado.saldo}
          />

          {alerta && <AlertMessage tipo={alerta.tipo} mensagem={alerta.mensagem} />}

          <Button
            variant="saida"
            disabled={salvando || alerta?.tipo === 'sucesso'}
            onClick={confirmarSaida}
            className="w-full"
          >
            {salvando ? 'Salvando...' : 'Confirmar retirada'}
          </Button>
        </div>
      </PageContent>
    )
  }

  if (passo === PASSOS.produto) {
    return (
      <PageContent narrow>
        <PageHeader
          title="Saída de material"
          subtitle={`Veículo vinculado: ${veiculo.trim()}`}
          meta="Tipo de movimentação: Saída / consumo"
        />

        <div className="space-y-4">
          <button
            type="button"
            onClick={() => {
              setPasso(PASSOS.veiculo)
              setAlerta(null)
            }}
            className="text-sm font-medium text-text-muted hover:text-primary"
          >
            ← Alterar veículo
          </button>

          <SearchField valor={busca} onChange={setBusca} />
          {alerta && <AlertMessage tipo={alerta.tipo} mensagem={alerta.mensagem} />}

          {produtos.length === 0 ? (
            <Card className="text-center text-sm text-text-muted">
              Nenhum produto encontrado.
            </Card>
          ) : (
            <ul className="space-y-2">
              {produtos.map((produto) => (
                <li key={produto.id}>
                  <ProductListItem produto={produto} onSelect={selecionarProduto} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </PageContent>
    )
  }

  return (
    <PageContent narrow>
      <PageHeader
        title="Saída de material"
        subtitle="Informe o veículo de destino antes da baixa de estoque."
        meta="Tipo de movimentação: Saída / consumo"
      />

      <div className="space-y-5">
        <BackLink />

        <div>
          <label className="mb-2 block text-sm font-semibold text-text-primary">
            Veículo ou placa
          </label>
          <input
            type="text"
            value={veiculo}
            onChange={(e) => setVeiculo(e.target.value)}
            placeholder="Ex: Porsche Cayenne — ABC1D23"
            className="w-full rounded-lg border border-border bg-card px-4 py-3 text-lg shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            autoComplete="off"
          />
        </div>

        {alerta && <AlertMessage tipo={alerta.tipo} mensagem={alerta.mensagem} />}

        <Button variant="saida" onClick={avancarVeiculo} className="w-full">
          Continuar
        </Button>
      </div>
    </PageContent>
  )
}
