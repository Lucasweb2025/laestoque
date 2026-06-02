import { fornecedoresIniciais } from '../data/fornecedoresIniciais'

const CHAVE_FORNECEDORES = 'la-estoque-fornecedores'

function sincronizarComInicial(salvos) {
  const porId = new Map(salvos.map((f) => [f.id, f]))
  fornecedoresIniciais.forEach((seed) => {
    if (!porId.has(seed.id)) {
      porId.set(seed.id, { ...seed })
    }
  })
  return Array.from(porId.values()).sort((a, b) =>
    a.nome.localeCompare(b.nome, 'pt-BR'),
  )
}

function lerFornecedores() {
  const salvo = localStorage.getItem(CHAVE_FORNECEDORES)
  if (!salvo) {
    const lista = [...fornecedoresIniciais]
    localStorage.setItem(CHAVE_FORNECEDORES, JSON.stringify(lista))
    return lista
  }
  const lista = sincronizarComInicial(JSON.parse(salvo))
  gravarFornecedores(lista)
  return lista
}

function gravarFornecedores(fornecedores) {
  localStorage.setItem(CHAVE_FORNECEDORES, JSON.stringify(fornecedores))
}

export function listarFornecedores() {
  return lerFornecedores()
}

export function buscarFornecedorPorId(id) {
  if (!id) return null
  return lerFornecedores().find((f) => f.id === id) ?? null
}

export function validarCadastroFornecedor({ nome, telefone, email }) {
  if (!nome?.trim()) {
    return { ok: false, mensagem: 'Informe o nome do fornecedor.' }
  }
  const tel = telefone?.trim()
  const mail = email?.trim()
  if (mail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
    return { ok: false, mensagem: 'E-mail inválido.' }
  }
  if (!tel && !mail) {
    return {
      ok: false,
      mensagem: 'Informe pelo menos telefone ou e-mail para contato.',
    }
  }
  return { ok: true }
}

export function cadastrarFornecedor({ nome, telefone = '', email = '' }) {
  const validacao = validarCadastroFornecedor({ nome, telefone, email })
  if (!validacao.ok) {
    throw new Error(validacao.mensagem)
  }

  const fornecedores = lerFornecedores()
  const novo = {
    id: `forn-${crypto.randomUUID().slice(0, 8)}`,
    nome: nome.trim(),
    telefone: telefone.trim(),
    email: email.trim().toLowerCase(),
  }
  fornecedores.push(novo)
  gravarFornecedores(fornecedores)
  return novo
}
