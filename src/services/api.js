/**
 * Camada de serviços HTTP (Phase 1).
 * Pronta para o backend compartilhado — token injetado pelo app pai.
 */

import { obterHeadersAutenticados } from '../integracao/plataformaAuth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api'

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...obterHeadersAutenticados(),
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message ?? 'Não foi possível concluir a operação.')
  }

  return response.json()
}

/** GET — listar produtos do estoque */
export function buscarProdutos() {
  return request('/produtos')
}

/** GET — listar veículos */
export function buscarVeiculos() {
  return request('/veiculos')
}

/** POST — registrar entrada de mercadoria (Chegada) — API remota */
export function registrarChegadaDeMaterialApi(dados) {
  return request('/movimentacoes/entrada', {
    method: 'POST',
    body: JSON.stringify(dados),
  })
}

/** POST — registrar saída/consumo de material — API remota */
export function registrarSaidaDeMaterialApi(dados) {
  return request('/movimentacoes/saida', {
    method: 'POST',
    body: JSON.stringify(dados),
  })
}
