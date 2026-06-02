import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AlertMessage from '../components/AlertMessage'
import Button from '../components/Button'
import Card from '../components/Card'
import FormField, { inputClassName } from '../components/FormField'
import PageContent from '../components/layout/PageContent'
import PageHeader from '../components/layout/PageHeader'
import ProductThumb from '../components/ProductThumb'
import { formatarQuantidade, interpretarQuantidade } from '../domain/estoque'
import {
  buscarProdutoPorId,
  registrarPedidoReposicao,
} from '../services/estoqueService'

export default function PedidoReposicaoView() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const produtoId = searchParams.get('produto') ?? ''

  const produto = useMemo(
    () => (produtoId ? buscarProdutoPorId(produtoId) : null),
    [produtoId],
  )

  const [quantidadeTexto, setQuantidadeTexto] = useState('')
  const [observacao, setObservacao] = useState('')
  const [alerta, setAlerta] = useState(null)
  const [salvando, setSalvando] = useState(false)

  function confirmarPedido(e) {
    e.preventDefault()
    setAlerta(null)

    const quantidade = interpretarQuantidade(quantidadeTexto, produto.categoria)

    if (quantidade == null) {
      setAlerta({ tipo: 'erro', mensagem: 'Informe a quantidade desejada.' })
      return
    }

    setSalvando(true)

    try {
      registrarPedidoReposicao({
        produtoId: produto.id,
        quantidade,
        observacao,
      })

      setAlerta({
        tipo: 'sucesso',
        mensagem: `Solicitação registrada: ${formatarQuantidade(
          quantidade,
          produto.categoria,
        )} de ${produto.nome}. Após o recebimento, utilize Entrada de material.`,
      })

      setTimeout(() => navigate('/'), 2500)
    } catch (erro) {
      setAlerta({
        tipo: 'erro',
        mensagem: erro.message ?? 'Não foi possível registrar o pedido.',
      })
    } finally {
      setSalvando(false)
    }
  }

  if (!produtoId || !produto) {
    return (
      <PageContent narrow>
        <PageHeader title="Solicitação de reposição" subtitle="Produto não encontrado." />
        <Card>
          <p className="text-sm text-text-muted">
            Volte ao painel e use <strong>Solicitar reposição</strong> em um item em ruptura de estoque.
          </p>
          <Button variant="outline" to="/" className="mt-4">
            Voltar ao painel
          </Button>
        </Card>
      </PageContent>
    )
  }

  return (
    <PageContent narrow>
      <PageHeader
        title="Solicitação de reposição"
        subtitle="Registre a necessidade de material para o gestor de compras — estoque central em ruptura."
        meta="Quando a mercadoria chegar, registre em Entrada de material"
      />

      <Card>
        <form onSubmit={confirmarPedido} className="space-y-5">
          <div className="flex items-center gap-4 rounded-lg border border-amber-200/80 bg-amber-50/60 p-4">
            <ProductThumb produto={produto} tamanho="lg" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-amber-800">
                Estoque crítico
              </p>
              <p className="font-semibold text-text-primary">{produto.nome}</p>
              <p className="text-sm text-text-muted">
                Saldo atual:{' '}
                <span className="font-semibold text-danger-text">
                  {formatarQuantidade(produto.saldo, produto.categoria)}
                </span>
              </p>
            </div>
          </div>

          <FormField label="Quantidade desejada" required hint="Ex.: metros do rolo, litros, unidades">
            <input
              className={`${inputClassName} text-lg font-semibold`}
              value={quantidadeTexto}
              onChange={(e) => setQuantidadeTexto(e.target.value)}
              placeholder="Ex: 1 ou 1,5"
              autoFocus
            />
          </FormField>

          <FormField label="Observação para compras">
            <textarea
              className={`${inputClassName} min-h-[72px]`}
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Ex: urgente para Porsche RJ, fornecedor habitual..."
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
            {salvando ? 'Registrando...' : 'Confirmar solicitação'}
          </Button>

          <p className="text-center text-xs text-text-muted">
            Material chegou?{' '}
            <Link to="/chegada" className="font-semibold text-primary hover:underline">
              Registrar chegada
            </Link>
          </p>
        </form>
      </Card>
    </PageContent>
  )
}
