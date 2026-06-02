import { useMemo, useState } from 'react'
import AlertMessage from '../components/AlertMessage'
import Button from '../components/Button'
import Card from '../components/Card'
import FornecedorDetalheModal from '../components/FornecedorDetalheModal'
import FormField, { inputClassName } from '../components/FormField'
import PageContent from '../components/layout/PageContent'
import PageHeader from '../components/layout/PageHeader'
import {
  cadastrarFornecedor,
  listarFornecedores,
} from '../services/fornecedorService'

export default function FornecedoresView() {
  const [versaoLista, setVersaoLista] = useState(0)
  const fornecedores = useMemo(
    () => listarFornecedores(),
    [versaoLista],
  )

  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [alerta, setAlerta] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const [detalheAberto, setDetalheAberto] = useState(null)

  function salvarFornecedor(e) {
    e.preventDefault()
    setAlerta(null)
    setSalvando(true)

    try {
      const novo = cadastrarFornecedor({ nome, telefone, email })
      setNome('')
      setTelefone('')
      setEmail('')
      setVersaoLista((v) => v + 1)
      setAlerta({
        tipo: 'sucesso',
        mensagem: `Fornecedor “${novo.nome}” cadastrado.`,
      })
    } catch (erro) {
      setAlerta({
        tipo: 'erro',
        mensagem: erro.message ?? 'Não foi possível cadastrar.',
      })
    } finally {
      setSalvando(false)
    }
  }

  return (
    <PageContent narrow>
      <PageHeader
        title="Fornecedores"
        subtitle="Cadastro de fornecedores para vincular às entradas de material. Clique em um nome para ver telefone e e-mail."
      />

      <Card className="mb-6">
        <h2 className="mb-4 text-sm font-semibold text-text-primary">Novo fornecedor</h2>
        <form onSubmit={salvarFornecedor} className="space-y-4">
          <FormField label="Nome" required>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={inputClassName}
              placeholder="Ex: Suntek Brasil"
              required
            />
          </FormField>
          <FormField label="Telefone" required hint="WhatsApp ou fixo com DDD.">
            <input
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className={inputClassName}
              placeholder="(11) 99999-9999"
            />
          </FormField>
          <FormField label="E-mail">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClassName}
              placeholder="contato@fornecedor.com.br"
            />
          </FormField>

          {alerta && <AlertMessage tipo={alerta.tipo} mensagem={alerta.mensagem} />}

          <Button type="submit" disabled={salvando} className="w-full">
            {salvando ? 'Salvando...' : 'Cadastrar fornecedor'}
          </Button>
        </form>
      </Card>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-text-primary">
          Fornecedores cadastrados ({fornecedores.length})
        </h2>
        {fornecedores.length === 0 ? (
          <Card className="text-center text-sm text-text-muted">
            Nenhum fornecedor ainda. Use o formulário acima.
          </Card>
        ) : (
          <ul className="space-y-2">
            {fornecedores.map((f) => (
              <li key={f.id}>
                <button
                  type="button"
                  onClick={() => setDetalheAberto(f)}
                  className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-4 py-3.5 text-left shadow-sm transition-colors hover:border-primary/40 hover:bg-slate-50/80"
                >
                  <span className="font-medium text-text-primary">{f.nome}</span>
                  <span className="text-xs font-semibold text-primary">Ver dados →</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {detalheAberto && (
        <FornecedorDetalheModal
          fornecedor={detalheAberto}
          onFechar={() => setDetalheAberto(null)}
        />
      )}
    </PageContent>
  )
}
