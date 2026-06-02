import ChegadaView from './views/ChegadaView'
import EnvioUnidadeView from './views/EnvioUnidadeView'
import HomeView from './views/HomeView'
import InventarioView from './views/InventarioView'
import LocalizacaoProdutoView from './views/LocalizacaoProdutoView'
import NovoProdutoView from './views/NovoProdutoView'
import PedidoReposicaoView from './views/PedidoReposicaoView'
import AuditoriaGeralView from './views/AuditoriaGeralView'
import AuditoriaEnviosRedirect from './views/AuditoriaEnviosRedirect'
import RelatorioEnviosView from './views/RelatorioEnviosView'
import SaidaView from './views/SaidaView'
import FornecedoresView from './views/FornecedoresView'
import { PLATAFORMA } from './config/plataforma'

/**
 * Rotas exportáveis para a plataforma principal montar este módulo via React Router pai.
 * Exemplo: <Route path="/estoque/*" element={<ModuloEstoque />} />
 */
export const rotasModuloEstoque = [
  { index: true, path: '', element: <HomeView />, rotulo: 'Visão geral' },
  { path: 'chegada', element: <ChegadaView />, rotulo: 'Entrada de material' },
  { path: 'envio-unidade', element: <EnvioUnidadeView />, rotulo: 'Envio para unidade' },
  { path: 'relatorio/envios', element: <RelatorioEnviosView />, rotulo: 'Envios por unidade' },
  { path: 'auditoria', element: <AuditoriaGeralView />, rotulo: 'Auditoria geral' },
  { path: 'auditoria/envios', element: <AuditoriaEnviosRedirect />, rotulo: 'Auditoria de envios' },
  { path: 'saida', element: <SaidaView />, rotulo: 'Saída / consumo' },
  { path: 'produtos/novo', element: <NovoProdutoView />, rotulo: 'Novo produto' },
  { path: 'inventario', element: <InventarioView />, rotulo: 'Inventário inicial' },
  { path: 'produtos/localizacao', element: <LocalizacaoProdutoView />, rotulo: 'Localização no estoque' },
  { path: 'fornecedores', element: <FornecedoresView />, rotulo: 'Fornecedores' },
  { path: 'solicitacao-reposicao', element: <PedidoReposicaoView />, rotulo: 'Solicitação de reposição' },
]

export function caminhoModulo(subcaminho = '') {
  const base = PLATAFORMA.basePath.replace(/\/$/, '')
  const sub = subcaminho.replace(/^\//, '')
  return sub ? `${base}/${sub}` : base || '/'
}
