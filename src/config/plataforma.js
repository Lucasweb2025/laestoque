/**
 * Configuração do módulo Estoque para integração com a plataforma principal.
 *
 * Standalone (hoje): VITE_MODO_EMBEDDED=false — sidebar + topbar completos.
 * Embutido (futuro): VITE_MODO_EMBEDDED=true — só o conteúdo; o app pai fornece o chrome.
 */

export const PLATAFORMA = {
  /** Identificador único deste módulo no monorepo / router pai */
  moduloId: 'estoque',
  /** Prefixo de rota quando montado na plataforma (ex: /app/estoque) */
  basePath: import.meta.env.VITE_BASE_PATH ?? '/',
}

/** Estoque central / matriz (origem dos envios para as unidades) */
export const UNIDADE_CENTRAL = {
  id: 'lacustom-central',
  nome: import.meta.env.VITE_UNIDADE_NOME ?? 'LaCustom',
  filial: import.meta.env.VITE_UNIDADE_FILIAL ?? 'Central',
}

/** @deprecated use UNIDADE_CENTRAL — mantido para compatibilidade */
export const UNIDADE = UNIDADE_CENTRAL

/** true quando este app roda dentro do shell da plataforma principal */
export const modoEmbutido = import.meta.env.VITE_MODO_EMBEDDED === 'true'

/**
 * Contrato de API (Phase 1 — alinhar com o backend compartilhado).
 * Endpoints relativos a VITE_API_BASE_URL.
 */
export const contratoApi = {
  produtos: { listar: 'GET /produtos', criar: 'POST /produtos' },
  movimentacoes: {
    entrada: 'POST /movimentacoes/entrada',
    saida: 'POST /movimentacoes/saida',
    estoqueAtual: 'POST /movimentacoes/estoque-atual',
    envioUnidade: 'POST /movimentacoes/envio-unidade',
  },
  unidades: { listar: 'GET /unidades' },
  veiculos: { listar: 'GET /veiculos' },
  /** Header de auth que a plataforma deve injetar nas requisições */
  authHeader: 'Authorization',
}
