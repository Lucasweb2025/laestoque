/**
 * Unidades operacionais LA Custom — destino de envio de material.
 * Alinhar com gestão de compras e estoque central.
 */
export const unidadesOperacionais = [
  {
    id: 'mclaren-clodomiro',
    nome: 'McLaren Clodomiro',
    marca: 'McLaren',
    cidade: 'São Paulo',
  },
  {
    id: 'porsche-rio',
    nome: 'Porsche Rio de Janeiro',
    marca: 'Porsche',
    cidade: 'Rio de Janeiro',
  },
  {
    id: 'la-moema',
    nome: 'L.A Moema',
    marca: 'LA Custom',
    cidade: 'São Paulo',
  },
]

export function buscarUnidadePorId(id) {
  return unidadesOperacionais.find((u) => u.id === id) ?? null
}

export function buscarUnidadePorNome(nome) {
  const termo = nome.trim().toLowerCase()
  return (
    unidadesOperacionais.find((u) => u.nome.toLowerCase() === termo) ?? null
  )
}
