export const CATEGORIAS = {
  pelicula: { label: 'Película / PPF', unidade: 'm', permiteDecimal: true },
  quimico: { label: 'Químico', unidade: 'L', permiteDecimal: true },
  acessorio: { label: 'Acessório', unidade: 'un', permiteDecimal: false },
}

export function obterConfigCategoria(categoria) {
  return CATEGORIAS[categoria] ?? CATEGORIAS.acessorio
}

export function formatarSaldoTabela(valor, categoria) {
  const numero = Number(valor)
  if (Number.isNaN(numero)) return '0'

  const { permiteDecimal } = obterConfigCategoria(categoria)
  return permiteDecimal
    ? numero.toLocaleString('pt-BR', { maximumFractionDigits: 2 })
    : String(Math.round(numero))
}

export function formatarQuantidade(valor, categoria) {
  const { unidade, permiteDecimal } = obterConfigCategoria(categoria)
  const numero = Number(valor)
  if (Number.isNaN(numero)) return `0 ${unidade}`

  const texto = permiteDecimal
    ? numero.toLocaleString('pt-BR', { maximumFractionDigits: 2 })
    : String(Math.round(numero))

  return `${texto} ${unidade}`
}

/** Aceita "1,5" ou "1.5" */
export function interpretarQuantidade(texto, categoria) {
  if (texto === '' || texto == null) return null

  const normalizado = String(texto).trim().replace(',', '.')
  const valor = Number(normalizado)

  if (Number.isNaN(valor) || valor <= 0) return null

  const { permiteDecimal } = obterConfigCategoria(categoria)
  if (!permiteDecimal && !Number.isInteger(valor)) return null

  return valor
}

/** Inventário: aceita zero (prateleira vazia) e decimais (meio rolo, retalho). */
export function interpretarSaldoInventario(texto, categoria) {
  if (texto === '' || texto == null) return null

  const normalizado = String(texto).trim().replace(',', '.')
  const valor = Number(normalizado)

  if (Number.isNaN(valor) || valor < 0) return null

  const { permiteDecimal } = obterConfigCategoria(categoria)
  if (!permiteDecimal && !Number.isInteger(valor)) return null

  return valor
}

export function validarCadastroProduto({ nome, referencia, categoria }) {
  if (!nome?.trim()) {
    return { ok: false, mensagem: 'Informe o nome do produto.' }
  }
  if (!referencia?.trim()) {
    return { ok: false, mensagem: 'Informe a referência do produto.' }
  }
  if (!CATEGORIAS[categoria]) {
    return { ok: false, mensagem: 'Selecione uma categoria válida.' }
  }
  return { ok: true }
}

export function validarSaldoSuficiente(saldoAtual, quantidade) {
  if (quantidade <= 0) {
    return { ok: false, mensagem: 'Informe uma quantidade válida.' }
  }
  if (quantidade > saldoAtual) {
    return { ok: false, mensagem: 'Saldo insuficiente.' }
  }
  return { ok: true }
}
