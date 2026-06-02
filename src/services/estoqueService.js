import { produtosIniciais } from '../data/produtosIniciais'
import { buscarUnidadePorId, unidadesOperacionais } from '../data/unidades'
import { formatarQuantidade, validarSaldoSuficiente } from '../domain/estoque'
import { buscarFornecedorPorId } from './fornecedorService'

const CHAVE_PRODUTOS = 'la-estoque-produtos'
const CHAVE_MOVIMENTOS = 'la-estoque-movimentos'

function sincronizarComCatalogoInicial(produtosSalvos) {
  const porId = new Map(produtosSalvos.map((p) => [p.id, p]))

  produtosIniciais.forEach((seed) => {
    const atual = porId.get(seed.id)
    if (!atual) {
      porId.set(seed.id, { ...seed })
      return
    }
    porId.set(seed.id, {
      ...seed,
      ...atual,
      saldo: atual.saldo,
      marca: atual.marca?.trim() || seed.marca,
      localizacao: atual.localizacao?.trim() || seed.localizacao,
    })
  })

  return Array.from(porId.values())
}

function lerProdutos() {
  const salvo = localStorage.getItem(CHAVE_PRODUTOS)
  if (!salvo) {
    localStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(produtosIniciais))
    return [...produtosIniciais]
  }

  const produtos = sincronizarComCatalogoInicial(JSON.parse(salvo))
  gravarProdutos(produtos)
  return produtos
}

function gravarProdutos(produtos) {
  localStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(produtos))
}

function registrarMovimento(movimento) {
  const lista = JSON.parse(localStorage.getItem(CHAVE_MOVIMENTOS) ?? '[]')
  lista.unshift({
    id: crypto.randomUUID(),
    criadoEm: new Date().toISOString(),
    ...movimento,
  })
  localStorage.setItem(CHAVE_MOVIMENTOS, JSON.stringify(lista))
}

export function listarProdutos() {
  return lerProdutos()
}

export function obterResumoEstoque() {
  const produtos = lerProdutos()
  const semEstoque = produtos.filter((p) => p.saldo <= 0).length
  const comEstoque = produtos.length - semEstoque

  return {
    total: produtos.length,
    comEstoque,
    semEstoque,
  }
}

export function buscarProdutos(filtro = '') {
  const termo = filtro.trim().toLowerCase()
  return lerProdutos().filter((produto) => {
    if (!termo) return true
    return (
      produto.id.toLowerCase().includes(termo) ||
      produto.nome.toLowerCase().includes(termo) ||
      produto.referencia.toLowerCase().includes(termo)
    )
  })
}

export function buscarProdutoPorId(id) {
  return lerProdutos().find((p) => p.id === id) ?? null
}

export function registrarChegadaDeMaterial({
  produtoId,
  quantidade,
  observacao = '',
  fornecedorId = '',
}) {
  const produtos = lerProdutos()
  const indice = produtos.findIndex((p) => p.id === produtoId)

  if (indice === -1) {
    throw new Error('Produto não encontrado.')
  }

  const fornecedor = fornecedorId ? buscarFornecedorPorId(fornecedorId) : null
  if (fornecedorId && !fornecedor) {
    throw new Error('Fornecedor não encontrado.')
  }

  produtos[indice] = {
    ...produtos[indice],
    saldo: produtos[indice].saldo + quantidade,
  }

  gravarProdutos(produtos)
  registrarMovimento({
    tipo: 'entrada',
    produtoId,
    quantidade,
    observacao,
    ...(fornecedor && {
      fornecedorId: fornecedor.id,
      fornecedorNome: fornecedor.nome,
    }),
  })

  return produtos[indice]
}

export function registrarSaidaDeMaterial({
  produtoId,
  quantidade,
  veiculo = '',
  observacao = '',
}) {
  const produtos = lerProdutos()
  const indice = produtos.findIndex((p) => p.id === produtoId)

  if (indice === -1) {
    throw new Error('Produto não encontrado.')
  }

  const produto = produtos[indice]
  const validacao = validarSaldoSuficiente(produto.saldo, quantidade)

  if (!validacao.ok) {
    throw new Error(validacao.mensagem)
  }

  produtos[indice] = {
    ...produto,
    saldo: produto.saldo - quantidade,
  }

  gravarProdutos(produtos)
  registrarMovimento({
    tipo: 'saida',
    produtoId,
    quantidade,
    veiculo,
    observacao,
  })

  return produtos[indice]
}

function gerarProximoCodigoProduto(produtos) {
  const numeros = produtos
    .map((p) => parseInt(p.id, 10))
    .filter((n) => !Number.isNaN(n))

  const proximo = numeros.length > 0 ? Math.max(...numeros) + 1 : 1000
  return String(proximo)
}

export function cadastrarProduto({
  nome,
  referencia,
  categoria,
  marca = '',
  localizacao = '',
  saldoInicial,
  observacaoInventario = '',
}) {
  const produtos = lerProdutos()
  const id = gerarProximoCodigoProduto(produtos)

  const produto = {
    id,
    nome: nome.trim(),
    referencia: referencia.trim(),
    categoria,
    marca: marca.trim(),
    localizacao: localizacao.trim(),
    saldo: 0,
    imagemUrl: null,
  }

  produtos.push(produto)
  gravarProdutos(produtos)

  if (saldoInicial != null && saldoInicial >= 0) {
    return definirSaldoAtual({
      produtoId: id,
      saldoNovo: saldoInicial,
      observacao: observacaoInventario || 'Saldo definido no cadastro do produto',
    })
  }

  return produto
}

/** Atualiza o endereço físico do produto no estoque central. */
export function atualizarLocalizacaoProduto({ produtoId, localizacao, observacao = '' }) {
  const produtos = lerProdutos()
  const indice = produtos.findIndex((p) => p.id === produtoId)

  if (indice === -1) {
    throw new Error('Produto não encontrado.')
  }

  const endereco = localizacao.trim()
  if (!endereco) {
    throw new Error('Informe onde o produto está no estoque central.')
  }

  const anterior = produtos[indice].localizacao ?? ''
  produtos[indice] = {
    ...produtos[indice],
    localizacao: endereco,
  }

  gravarProdutos(produtos)
  registrarMovimento({
    tipo: 'localizacao',
    produtoId,
    produtoNome: produtos[indice].nome,
    localizacaoAnterior: anterior,
    localizacaoNova: endereco,
    observacao,
  })

  return produtos[indice]
}

/** Define o saldo real (inventário / meio rolo / retalho) — substitui, não soma. */
export function definirSaldoAtual({ produtoId, saldoNovo, observacao = '' }) {
  const produtos = lerProdutos()
  const indice = produtos.findIndex((p) => p.id === produtoId)

  if (indice === -1) {
    throw new Error('Produto não encontrado.')
  }

  const saldoAnterior = produtos[indice].saldo

  produtos[indice] = {
    ...produtos[indice],
    saldo: saldoNovo,
  }

  gravarProdutos(produtos)
  registrarMovimento({
    tipo: 'estoque_atual',
    produtoId,
    saldoAnterior,
    saldoNovo,
    quantidade: saldoNovo - saldoAnterior,
    observacao,
  })

  return produtos[indice]
}

function lerMovimentos() {
  return JSON.parse(localStorage.getItem(CHAVE_MOVIMENTOS) ?? '[]')
}

/**
 * Material sai do estoque central e é registrado como enviado para uma unidade.
 */
export function registrarEnvioParaUnidade({
  unidadeId,
  produtoId,
  quantidade,
  observacao = '',
}) {
  const unidade = buscarUnidadePorId(unidadeId)
  if (!unidade) {
    throw new Error('Unidade de destino não encontrada.')
  }

  const produtos = lerProdutos()
  const indice = produtos.findIndex((p) => p.id === produtoId)

  if (indice === -1) {
    throw new Error('Produto não encontrado.')
  }

  const produto = produtos[indice]
  const validacao = validarSaldoSuficiente(produto.saldo, quantidade)

  if (!validacao.ok) {
    throw new Error(validacao.mensagem)
  }

  produtos[indice] = {
    ...produto,
    saldo: produto.saldo - quantidade,
  }

  gravarProdutos(produtos)
  registrarMovimento({
    tipo: 'envio_unidade',
    unidadeId,
    unidadeNome: unidade.nome,
    produtoId,
    produtoNome: produto.nome,
    produtoReferencia: produto.referencia,
    produtoCategoria: produto.categoria,
    quantidade,
    observacao,
  })

  return { produto: produtos[indice], unidade }
}

/** Pedido de reposição quando saldo está zerado / crítico (gestão de compras). */
export function registrarPedidoReposicao({
  produtoId,
  quantidade,
  observacao = '',
}) {
  const produtos = lerProdutos()
  const produto = produtos.find((p) => p.id === produtoId)

  if (!produto) {
    throw new Error('Produto não encontrado.')
  }

  registrarMovimento({
    tipo: 'pedido_reposicao',
    produtoId,
    produtoNome: produto.nome,
    produtoReferencia: produto.referencia,
    produtoCategoria: produto.categoria,
    quantidade,
    observacao,
    status: 'pendente',
  })

  return produto
}

export const FILTROS_AUDITORIA = {
  todos: { label: 'Todos', tipos: null },
  chegada: { label: 'Chegadas', tipos: ['entrada'] },
  saida: { label: 'Saídas', tipos: ['saida'] },
  envio: { label: 'Envios p/ unidade', tipos: ['envio_unidade'] },
}

const ROTULOS_TIPO_MOVIMENTO = {
  entrada: 'Chegada',
  saida: 'Saída / consumo',
  envio_unidade: 'Envio p/ unidade',
  estoque_atual: 'Inventário',
  pedido_reposicao: 'Solicitação reposição',
  localizacao: 'Localização',
}

function formatarDataHoraAuditoria(criadoEm) {
  return new Date(criadoEm).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function mapearMovimentoAuditoria(movimento, produtos) {
  const produto = produtos.find((p) => p.id === movimento.produtoId)
  const categoria = movimento.produtoCategoria ?? produto?.categoria ?? 'acessorio'
  const nome = movimento.produtoNome ?? produto?.nome ?? 'Produto removido'
  const referencia = movimento.produtoReferencia ?? produto?.referencia ?? '—'

  let quantidadeColuna = '—'
  let detalhe = '—'

  switch (movimento.tipo) {
    case 'entrada':
      quantidadeColuna = formatarQuantidade(movimento.quantidade, categoria)
      detalhe = movimento.fornecedorNome?.trim() || 'Estoque central'
      break
    case 'saida':
      quantidadeColuna = formatarQuantidade(movimento.quantidade, categoria)
      detalhe = movimento.veiculo?.trim() || 'Consumo no serviço'
      break
    case 'envio_unidade':
      quantidadeColuna = formatarQuantidade(movimento.quantidade, categoria)
      detalhe = movimento.unidadeNome ?? '—'
      break
    case 'estoque_atual':
      quantidadeColuna = `${formatarQuantidade(movimento.saldoAnterior, categoria)} → ${formatarQuantidade(movimento.saldoNovo, categoria)}`
      detalhe = 'Ajuste de saldo'
      break
    case 'pedido_reposicao':
      quantidadeColuna = formatarQuantidade(movimento.quantidade, categoria)
      detalhe = 'Pedido para compras'
      break
    case 'localizacao':
      quantidadeColuna = '—'
      detalhe = movimento.localizacaoNova ?? '—'
      break
    default:
      break
  }

  return {
    id: movimento.id,
    criadoEm: movimento.criadoEm,
    dataHoraFormatada: formatarDataHoraAuditoria(movimento.criadoEm),
    tipo: movimento.tipo,
    tipoLabel: ROTULOS_TIPO_MOVIMENTO[movimento.tipo] ?? movimento.tipo,
    produtoNome: nome,
    produtoReferencia: referencia,
    quantidadeColuna,
    detalhe,
    fornecedorId: movimento.fornecedorId ?? null,
    observacao: movimento.observacao?.trim() || '—',
  }
}

/** Auditoria geral: chegadas, saídas, envios e demais movimentos (mais recente primeiro). */
export function listarAuditoriaGeral(filtro = 'todos') {
  const config = FILTROS_AUDITORIA[filtro] ?? FILTROS_AUDITORIA.todos
  const produtos = lerProdutos()

  return lerMovimentos()
    .filter((m) => !config.tipos || config.tipos.includes(m.tipo))
    .map((m) => mapearMovimentoAuditoria(m, produtos))
}

/** Auditoria só de envios — compatível com relatório por unidade. */
export function listarAuditoriaEnviosUnidade() {
  const produtos = lerProdutos()

  return lerMovimentos()
    .filter((m) => m.tipo === 'envio_unidade')
    .map((m) => {
      const linha = mapearMovimentoAuditoria(m, produtos)
      return {
        id: linha.id,
        criadoEm: linha.criadoEm,
        dataHoraFormatada: linha.dataHoraFormatada,
        produtoNome: linha.produtoNome,
        produtoReferencia: linha.produtoReferencia,
        quantidade: m.quantidade,
        quantidadeFormatada: linha.quantidadeColuna,
        unidadeNome: m.unidadeNome ?? '—',
        unidadeId: m.unidadeId,
        observacao: linha.observacao,
      }
    })
}

/** Resumo para gestão de compras: quanto foi enviado para cada unidade. */
export function obterResumoEnviosPorUnidade() {
  const movimentos = lerMovimentos().filter((m) => m.tipo === 'envio_unidade')
  const produtos = lerProdutos()

  return unidadesOperacionais.map((unidade) => {
    const envios = movimentos.filter((m) => m.unidadeId === unidade.id)

    const totaisPorProduto = {}
    envios.forEach((m) => {
      totaisPorProduto[m.produtoId] = (totaisPorProduto[m.produtoId] ?? 0) + m.quantidade
    })

    const itens = Object.entries(totaisPorProduto)
      .map(([produtoId, total]) => {
        const produto = produtos.find((p) => p.id === produtoId)
        if (!produto) return null
        return {
          produtoId,
          nome: produto.nome,
          referencia: produto.referencia,
          categoria: produto.categoria,
          total,
          totalFormatado: formatarQuantidade(total, produto.categoria),
        }
      })
      .filter(Boolean)
      .sort((a, b) => a.nome.localeCompare(b.nome))

    return {
      ...unidade,
      quantidadeEnvios: envios.length,
      itens,
    }
  })
}
