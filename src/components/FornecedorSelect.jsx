import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import FornecedorDetalheModal from './FornecedorDetalheModal'
import FormField, { selectClassName } from './FormField'
import { listarFornecedores } from '../services/fornecedorService'

export default function FornecedorSelect({ value, onChange, label = 'Fornecedor' }) {
  const [modalAberto, setModalAberto] = useState(false)
  const fornecedores = useMemo(() => listarFornecedores(), [])

  const selecionado = fornecedores.find((f) => f.id === value) ?? null

  return (
    <div>
      <FormField
        label={label}
        hint={
          fornecedores.length === 0 ? (
            <>
              Nenhum fornecedor cadastrado.{' '}
              <Link to="/fornecedores" className="font-semibold text-primary hover:underline">
                Cadastrar fornecedor
              </Link>
            </>
          ) : (
            'Opcional. Clique em “Ver dados” para nome, telefone e e-mail.'
          )
        }
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={selectClassName}
            disabled={fornecedores.length === 0}
          >
            <option value="">Sem fornecedor</option>
            {fornecedores.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nome}
              </option>
            ))}
          </select>
          {selecionado && (
            <button
              type="button"
              onClick={() => setModalAberto(true)}
              className="shrink-0 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/10"
            >
              Ver dados
            </button>
          )}
        </div>
      </FormField>

      {selecionado && (
        <button
          type="button"
          onClick={() => setModalAberto(true)}
          className="mt-1 text-left text-xs text-text-muted hover:text-primary"
        >
          {selecionado.nome} · clique para ver telefone e e-mail
        </button>
      )}

      {modalAberto && selecionado && (
        <FornecedorDetalheModal
          fornecedor={selecionado}
          onFechar={() => setModalAberto(false)}
        />
      )}
    </div>
  )
}
