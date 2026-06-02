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
import {
  formatarQuantidade,
  interpretarSaldoInventario,
  obterConfigCategoria,
} from '../domain/estoque'
import { buscarProdutos, definirSaldoAtual } from '../services/estoqueService'

export default function InventarioView() {
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')
  const [produtoSelecionado, setProdutoSelecionado] = useState(null)
  const [saldoTexto, setSaldoTexto] = useState('')
  const [observacao, setObservacao] = useState('')
  const [alerta, setAlerta] = useState(null)
  const [salvando, setSalvando] = useState(false)

  const produtos = useMemo(() => buscarProdutos(busca), [busca])

  function selecionarProduto(produto) {
    setProdutoSelecionado(produto)
    setSaldoTexto(String(produto.saldo).replace('.', ','))
    setObservacao('')
    setAlerta(null)
  }

  function confirmarInventario(e) {
    e.preventDefault()
    setAlerta(null)

    const saldoNovo = interpretarSaldoInventario(
      saldoTexto,
      produtoSelecionado.categoria,
    )

    if (saldoNovo == null) {
      setAlerta({
        tipo: 'erro',
        mensagem: 'Informe o saldo real na prateleira (pode ser zero).',
      })
      return
    }

    setSalvando(true)

    try {
      const atualizado = definirSaldoAtual({
        produtoId: produtoSelecionado.id,
        saldoNovo,
        observacao: observacao || 'Inventário / estoque atual',
      })

      setAlerta({
        tipo: 'sucesso',
        mensagem: `Saldo atualizado para ${formatarQuantidade(
          atualizado.saldo,
          atualizado.categoria,
        )}.`,
      })

      setTimeout(() => navigate('/'), 1800)
    } catch (erro) {
      setAlerta({
        tipo: 'erro',
        mensagem: erro.message ?? 'Não foi possível atualizar o saldo.',
      })
    } finally {
      setSalvando(false)
    }
  }

  if (produtoSelecionado) {
    const { unidade } = obterConfigCategoria(produtoSelecionado.categoria)

    return (
      <PageContent narrow>
        <PageHeader
          title="Inventário inicial"
          subtitle="Defina o saldo real — meio rolo, retalho ou unidade fechada."
          meta="Tipo de movimentação: Estoque atual"
        />

        <Card>
          <form onSubmit={confirmarInventario} className="space-y-5">
            <button
              type="button"
              onClick={() => {
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
                <p className="text-xs text-text-muted">
                  Código {produtoSelecionado.id} · {produtoSelecionado.referencia}
                </p>
                <p className="mt-1 text-sm text-text-muted">
                  Saldo no sistema:{' '}
                  <strong className="text-text-primary">
                    {formatarQuantidade(
                      produtoSelecionado.saldo,
                      produtoSelecionado.categoria,
                    )}
                  </strong>
                </p>
              </div>
            </div>

            <FormField
              label={`Saldo real na prateleira (${unidade})`}
              required
              hint="Substitui o saldo anterior. Use 0 se acabou. Decimais com vírgula."
            >
              <input
                className={`${inputClassName} text-lg font-semibold`}
                value={saldoTexto}
                onChange={(e) => setSaldoTexto(e.target.value)}
                inputMode={unidade === 'un' ? 'numeric' : 'decimal'}
              />
            </FormField>

            <FormField label="Observação">
              <textarea
                className={`${inputClassName} min-h-[72px]`}
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Ex: rolo aberto 60%, frasco meio cheio..."
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
              {salvando ? 'Salvando...' : 'Confirmar saldo atual'}
            </Button>
          </form>
        </Card>
      </PageContent>
    )
  }

  return (
    <PageContent narrow>
      <PageHeader
        title="Inventário inicial"
        subtitle="Conte o que existe hoje em cada item. Não use esta tela para mercadoria que acabou de chegar — use Entrada de material."
        meta="Configuração · Administrador"
        actions={
          <Button variant="outline" to="/produtos/novo">
            + Novo produto
          </Button>
        }
      />

      <div className="mb-4 rounded-lg border border-primary/20 bg-primary-muted px-4 py-3 text-sm text-primary">
        <strong>Dica:</strong> para meio rolo ou retalho, informe metros ou litros reais (ex:{' '}
        <span className="font-mono">8,5</span> m), não “meio rolo”.
      </div>

      <SearchField
        valor={busca}
        onChange={setBusca}
        placeholder="Buscar produto para contagem..."
        className="mb-4"
      />

      {produtos.length === 0 ? (
        <Card className="text-center text-sm text-text-muted">
          Nenhum produto encontrado.{' '}
          <button
            type="button"
            onClick={() => navigate('/produtos/novo')}
            className="font-semibold text-primary hover:underline"
          >
            Cadastrar primeiro produto
          </button>
        </Card>
      ) : (
        <ul className="space-y-2">
          {produtos.map((produto) => (
            <li key={produto.id}>
              <ProductListItem
                produto={produto}
                onSelect={selecionarProduto}
                destaqueSemEstoque={false}
              />
            </li>
          ))}
        </ul>
      )}
    </PageContent>
  )
}
