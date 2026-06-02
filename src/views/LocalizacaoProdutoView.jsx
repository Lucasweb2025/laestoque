import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AlertMessage from '../components/AlertMessage'
import Button from '../components/Button'
import CampoLocalizacao from '../components/CampoLocalizacao'
import Card from '../components/Card'
import FormField, { inputClassName } from '../components/FormField'
import PageContent from '../components/layout/PageContent'
import PageHeader from '../components/layout/PageHeader'
import ProductListItem from '../components/ProductListItem'
import ProductThumb from '../components/ProductThumb'
import SearchField from '../components/SearchField'
import { localizacoesSugeridas } from '../data/localizacoesSugeridas'
import {
  atualizarLocalizacaoProduto,
  buscarProdutoPorId,
  buscarProdutos,
} from '../services/estoqueService'

export default function LocalizacaoProdutoView() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const produtoIdUrl = searchParams.get('produto') ?? ''

  const [busca, setBusca] = useState('')
  const [produtoSelecionado, setProdutoSelecionado] = useState(() =>
    produtoIdUrl ? buscarProdutoPorId(produtoIdUrl) : null,
  )
  const [localizacao, setLocalizacao] = useState(() => produtoSelecionado?.localizacao ?? '')
  const [observacao, setObservacao] = useState('')
  const [alerta, setAlerta] = useState(null)
  const [salvando, setSalvando] = useState(false)

  const produtos = useMemo(() => buscarProdutos(busca), [busca])

  function selecionarProduto(produto) {
    setProdutoSelecionado(produto)
    setLocalizacao(produto.localizacao ?? '')
    setObservacao('')
    setAlerta(null)
  }

  function aplicarSugestao(valor) {
    setLocalizacao(valor)
    setAlerta(null)
  }

  function confirmar(e) {
    e.preventDefault()
    setAlerta(null)

    setSalvando(true)

    try {
      const atualizado = atualizarLocalizacaoProduto({
        produtoId: produtoSelecionado.id,
        localizacao,
        observacao,
      })

      setAlerta({
        tipo: 'sucesso',
        mensagem: `Localização atualizada: ${atualizado.localizacao}`,
      })

      setTimeout(() => navigate('/'), 1800)
    } catch (erro) {
      setAlerta({
        tipo: 'erro',
        mensagem: erro.message ?? 'Não foi possível salvar a localização.',
      })
    } finally {
      setSalvando(false)
    }
  }

  if (produtoSelecionado) {
    return (
      <PageContent narrow>
        <PageHeader
          title="Localização no estoque"
          subtitle="Informe onde o material está guardado no estoque central."
          meta={`Produto ${produtoSelecionado.id} · ${produtoSelecionado.nome}`}
        />

        <Card>
          <form onSubmit={confirmar} className="space-y-5">
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
                <p className="text-sm text-text-muted">{produtoSelecionado.referencia}</p>
              </div>
            </div>

            <CampoLocalizacao value={localizacao} onChange={setLocalizacao} required />

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
                Sugestões rápidas
              </p>
              <div className="flex flex-wrap gap-2">
                {localizacoesSugeridas.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => aplicarSugestao(item)}
                    className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                      localizacao === item
                        ? 'border-primary bg-primary-muted text-primary'
                        : 'border-border bg-card text-text-secondary hover:border-primary/40'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <FormField label="Observação">
              <input
                className={inputClassName}
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Ex.: mudou de corredor após reorganização"
              />
            </FormField>

            {alerta && <AlertMessage tipo={alerta.tipo} mensagem={alerta.mensagem} />}

            <Button
              type="submit"
              variant="primary"
              disabled={salvando || alerta?.tipo === 'sucesso'}
              className="w-full"
            >
              {salvando ? 'Salvando...' : 'Salvar localização'}
            </Button>
          </form>
        </Card>
      </PageContent>
    )
  }

  return (
    <PageContent narrow>
      <PageHeader
        title="Localização no estoque"
        subtitle="Defina ou altere onde cada produto fica no estoque central — aparece na coluna Localização do painel."
        meta="Endereço físico · corredor e prateleira"
      />

      <div className="space-y-4">
        <SearchField valor={busca} onChange={setBusca} />
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
