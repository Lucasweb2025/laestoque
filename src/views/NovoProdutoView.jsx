import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AlertMessage from '../components/AlertMessage'
import Button from '../components/Button'
import Card from '../components/Card'
import CampoLocalizacao from '../components/CampoLocalizacao'
import FormField, { inputClassName, selectClassName } from '../components/FormField'
import PageContent from '../components/layout/PageContent'
import PageHeader from '../components/layout/PageHeader'
import {
  CATEGORIAS,
  interpretarSaldoInventario,
  obterConfigCategoria,
  validarCadastroProduto,
} from '../domain/estoque'
import { cadastrarProduto } from '../services/estoqueService'

export default function NovoProdutoView() {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [referencia, setReferencia] = useState('')
  const [categoria, setCategoria] = useState('pelicula')
  const [marca, setMarca] = useState('')
  const [localizacao, setLocalizacao] = useState('')
  const [saldoTexto, setSaldoTexto] = useState('')
  const [observacao, setObservacao] = useState('')
  const [alerta, setAlerta] = useState(null)
  const [salvando, setSalvando] = useState(false)

  const { unidade, label: labelCategoria } = obterConfigCategoria(categoria)

  function salvarProduto(e) {
    e.preventDefault()
    setAlerta(null)

    const validacao = validarCadastroProduto({ nome, referencia, categoria })
    if (!validacao.ok) {
      setAlerta({ tipo: 'erro', mensagem: validacao.mensagem })
      return
    }

    let saldoInicial = null
    if (saldoTexto.trim() !== '') {
      saldoInicial = interpretarSaldoInventario(saldoTexto, categoria)
      if (saldoInicial == null) {
        setAlerta({
          tipo: 'erro',
          mensagem: `Informe um saldo válido em ${unidade} (use vírgula para decimais).`,
        })
        return
      }
    }

    setSalvando(true)

    try {
      const produto = cadastrarProduto({
        nome,
        referencia,
        categoria,
        marca,
        localizacao,
        saldoInicial: saldoInicial ?? 0,
        observacaoInventario:
          observacao || (saldoInicial != null ? 'Inventário inicial no cadastro' : ''),
      })

      setAlerta({
        tipo: 'sucesso',
        mensagem: `Produto ${produto.nome} cadastrado (código ${produto.id}).`,
      })

      setTimeout(() => navigate('/'), 2000)
    } catch (erro) {
      setAlerta({
        tipo: 'erro',
        mensagem: erro.message ?? 'Não foi possível cadastrar o produto.',
      })
    } finally {
      setSalvando(false)
    }
  }

  return (
    <PageContent narrow>
      <PageHeader
        title="Novo produto"
        subtitle="Cadastre itens do estoque antes do inventário físico. Aceita saldo parcial (meio rolo, retalho)."
        meta="Configuração · Administrador"
      />

      <Card>
        <form onSubmit={salvarProduto} className="space-y-5">
          <FormField label="Nome / descrição" required>
            <input
              className={inputClassName}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: PPF Transparente 1.52m"
            />
          </FormField>

          <FormField label="Referência" required hint="Código interno ou nome curto">
            <input
              className={inputClassName}
              value={referencia}
              onChange={(e) => setReferencia(e.target.value)}
              placeholder="Ex: PPF-TRANSP"
            />
          </FormField>

          <FormField label="Categoria" required>
            <select
              className={selectClassName}
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              {Object.entries(CATEGORIAS).map(([valor, cfg]) => (
                <option key={valor} value={valor}>
                  {cfg.label} ({cfg.unidade})
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Marca">
            <input
              className={inputClassName}
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              placeholder="Opcional"
            />
          </FormField>

          <CampoLocalizacao value={localizacao} onChange={setLocalizacao} />

          <hr className="border-border" />

          <p className="text-sm font-semibold text-title">Saldo na prateleira hoje</p>
          <p className="text-xs text-text-muted">
            Informe o que existe agora — inclusive meio rolo ({labelCategoria}). Deixe em branco
            para cadastrar com saldo zero e ajustar depois no inventário.
          </p>

          <FormField
            label={`Quantidade atual (${unidade})`}
            hint={
              categoria === 'acessorio'
                ? 'Somente números inteiros'
                : 'Aceita decimais com vírgula (ex: 12,5)'
            }
          >
            <input
              className={inputClassName}
              value={saldoTexto}
              onChange={(e) => setSaldoTexto(e.target.value)}
              placeholder={`0 ${unidade}`}
              inputMode={categoria === 'acessorio' ? 'numeric' : 'decimal'}
            />
          </FormField>

          <FormField label="Observação do inventário">
            <textarea
              className={`${inputClassName} min-h-[80px]`}
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Ex: rolo aberto, retalho, lote 2024..."
              rows={2}
            />
          </FormField>

          {alerta && <AlertMessage tipo={alerta.tipo} mensagem={alerta.mensagem} />}

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="button" variant="outline" onClick={() => navigate('/')} className="sm:flex-1">
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={salvando || alerta?.tipo === 'sucesso'}
              className="sm:flex-1"
            >
              {salvando ? 'Salvando...' : 'Cadastrar produto'}
            </Button>
          </div>
        </form>
      </Card>
    </PageContent>
  )
}
