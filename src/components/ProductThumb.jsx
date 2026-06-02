import { obterConfigCategoria } from '../domain/estoque'

const gradientes = {
  pelicula: 'from-slate-700 to-slate-900',
  quimico: 'from-emerald-700 to-teal-900',
  acessorio: 'from-blue-700 to-indigo-900',
}

function iniciais(nome) {
  return nome
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

export default function ProductThumb({ produto, tamanho = 'md' }) {
  const tamanhos = {
    sm: 'h-10 w-10 text-xs',
    md: 'h-12 w-12 text-sm',
    lg: 'h-16 w-16 text-base',
  }

  if (produto.imagemUrl) {
    return (
      <img
        src={produto.imagemUrl}
        alt=""
        className={`${tamanhos[tamanho]} shrink-0 rounded-lg object-cover ring-1 ring-border`}
      />
    )
  }

  const gradiente = gradientes[produto.categoria] ?? gradientes.acessorio
  const { label } = obterConfigCategoria(produto.categoria)

  return (
    <div
      className={`${tamanhos[tamanho]} flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${gradiente} font-bold text-white ring-1 ring-black/10`}
      title={label}
      aria-hidden="true"
    >
      {iniciais(produto.nome)}
    </div>
  )
}
