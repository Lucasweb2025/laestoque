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
import FornecedorSelect from '../components/FornecedorSelect'
import { formatarQuantidade, interpretarQuantidade } from '../domain/estoque'
import {
  buscarProdutos,
  registrarChegadaDeMaterial,
} from '../services/estoqueService'

export default function ChegadaView() {
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')
  const [produtoSelecionado, setProdutoSelecionado] = useState(null)
  const [quantidadeTexto, setQuantidadeTexto] = useState('')
  const [observacao, setObservacao] = useState('')
  const [fornecedorId, setFornecedorId] = useState('')
  const [alerta, setAlerta] = useState(null)
  const [salvando, setSalvando] = useState(false)

  const produtos = useMemo(() => buscarProdutos(busca), [busca])

  function voltarParaLista() {
    setProdutoSelecionado(null)
    setQuantidadeTexto('')
    setObservacao('')
    setFornecedorId('')
    setAlerta(null)
  }

  function confirmarChegada() {
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
      const atualizado = registrarChegadaDeMaterial({
        produtoId: produtoSelecionado.id,
        quantidade,
        observacao,
        fornecedorId,
      })

      setAlerta({
        tipo: 'sucesso',
        mensagem: `Chegada registrada! Novo saldo: ${formatarQuantidade(
          atualizado.saldo,
          atualizado.categoria,
        )}`,
      })

      setTimeout(() => navigate('/'), 1800)
    } catch (erro) {
      setAlerta({
        tipo: 'erro',
        mensagem: erro.message ?? 'Não foi possível registrar a chegada.',
      })
    } finally {
      setSalvando(false)
    }
  }

  if (produtoSelecionado) {
    return (
      <PageContent narrow>
      <PageHeader
        title="Entrada de material"
        subtitle="Registro formal de chegada ao estoque corporativo."
        meta="Tipo de movimentação: Entrada"
      />

        <div className="space-y-5">
          <button
            type="button"
            onClick={voltarParaLista}
            className="text-sm font-medium text-text-muted hover:text-primary"
          >
            ← Escolher outro produto
          </button>

          <Card className="flex items-center gap-4">
            <ProductThumb produto={produtoSelecionado} tamanho="lg" />
            <div>
              <p className="font-semibold text-text-primary">{produtoSelecionado.nome}</p>
              <p className="text-sm text-text-muted">
                Saldo atual:{' '}
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
            label="Quanto chegou?"
          />

          <FornecedorSelect value={fornecedorId} onChange={setFornecedorId} />

          <div>
            <label className="mb-2 block text-sm font-semibold text-text-primary">
              Observação (opcional)
            </label>
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Ex: nota do fornecedor, lote..."
            />
          </div>

          {alerta && <AlertMessage tipo={alerta.tipo} mensagem={alerta.mensagem} />}

          <Button
            variant="entrada"
            disabled={salvando || alerta?.tipo === 'sucesso'}
            onClick={confirmarChegada}
            className="w-full"
          >
            {salvando ? 'Salvando...' : 'Confirmar chegada'}
          </Button>
        </div>
      </PageContent>
    )
  }

  return (
    <PageContent narrow>
      <PageHeader
        title="Entrada de material"
        subtitle="Selecione o item para registrar a chegada."
        meta="Tipo de movimentação: Entrada"
      />

      <div className="space-y-4">
        <BackLink />
        <SearchField valor={busca} onChange={setBusca} />

        {produtos.length === 0 ? (
          <Card className="text-center text-sm text-text-muted">
            Nenhum produto encontrado.
          </Card>
        ) : (
          <ul className="space-y-2">
            {produtos.map((produto) => (
              <li key={produto.id}>
                <ProductListItem
                  produto={produto}
                  onSelect={setProdutoSelecionado}
                  destaqueSemEstoque={false}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageContent>
  )
}
