import { contratoApi } from '../config/plataforma'

/**
 * A plataforma principal (app pai) deve expor o token JWT antes de montar o módulo Estoque:
 *
 *   window.__PLATAFORMA__ = { token: '...', unidadeId: '...', perfil: 'gerente' | 'aplicador' }
 */
export function obterContextoPlataforma() {
  if (typeof window === 'undefined') return null
  return window.__PLATAFORMA__ ?? null
}

export function obterTokenAutenticacao() {
  const ctx = obterContextoPlataforma()
  if (ctx?.token) return ctx.token
  return import.meta.env.VITE_DEV_TOKEN ?? null
}

export function obterHeadersAutenticados() {
  const token = obterTokenAutenticacao()
  if (!token) return {}

  return {
    [contratoApi.authHeader]: `Bearer ${token}`,
  }
}

/** Perfil Aplicador: só saída — Phase 3 */
export function obterPerfilUsuario() {
  const ctx = obterContextoPlataforma()
  return ctx?.perfil ?? import.meta.env.VITE_DEV_PERFIL ?? 'gerente'
}
