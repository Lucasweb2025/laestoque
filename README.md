# Módulo Estoque — LA Custom

Documentação técnica do frontend de controle de estoque para estética automotiva premium. Este repositório é um **módulo React** pensado para rodar **standalone** hoje e ser **embutido na plataforma principal** depois.

> **Estado atual:** UI e regras de negócio completas no browser. Persistência em **localStorage** (sem banco de dados, sem backend em produção). Contrato de API documentado para integração futura.

---

## Resumo executivo

| Item | Descrição |
|------|-----------|
| **Objetivo** | Controlar **entrada**, **saldo**, **distribuição para unidades** e **consumo** de insumos (películas, químicos, acessórios). |
| **Público da UI** | Funcionários com pouca familiaridade com tecnologia — fluxos visuais, mensagens claras, alvo &lt; 30 s por operação. |
| **Estoque numérico** | Apenas no **estoque central** (LaCustom). Unidades recebem **histórico de envios**; saldo por loja é fase futura. |
| **Persistência** | `localStorage` (`la-estoque-produtos`, `la-estoque-movimentos`). |
| **Backend** | Não implementado. Stubs em `src/services/api.js` + contrato em `src/config/plataforma.js`. |

---

## Contexto de negócio

### Fluxo principal

```
Fornecedor
    ↓
Registrar chegada          →  saldo SOBE no estoque central
    ↓
(Inventário inicial        →  ajusta saldo real: meio rolo, retalho, zero)
    ↓
Envio para unidade         →  saldo DESCE no central; registra destino (McLaren, Porsche, Moema…)
    ↓
Retirar para uso           →  consumo no veículo/serviço (texto livre do veículo)
```

### Unidades

| ID | Nome | Observação |
|----|------|------------|
| `mclaren-clodomiro` | McLaren Clodomiro | São Paulo |
| `porsche-rio` | Porsche Rio de Janeiro | Rio de Janeiro |
| `la-moema` | L.A Moema | São Paulo |

Lista em `src/data/unidades.js`. Origem dos envios: **estoque central** (`UNIDADE_CENTRAL` em `src/config/plataforma.js`).

### Referência operacional

Telas inspiradas no **Oficina Inteligente** (OI), simplificadas:

| OI | Este módulo |
|----|-------------|
| Correção → Entrada | Registrar chegada |
| Correção → Estoque Atual | Inventário inicial |
| Separação → Entregar | Retirar para uso |
| Transferência entre lojas | Envio para unidade |
| Busca de produtos + End. | Registro de produtos + Localização |
| Solicitar compra / ruptura | Solicitação de reposição |

---

## Stack e execução

| Tecnologia | Versão (aprox.) |
|------------|-----------------|
| React | 19 |
| Vite | 8 |
| React Router | 7 |
| Tailwind CSS | 4 |

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # saída em dist/
npm run preview  # preview da build
```

### Demonstração para o gestor

| Arquivo | Uso |
|---------|-----|
| **`Abrir-Estoque-LA-Custom.vbs`** | Duplo clique → abre o navegador (sem janela preta) |
| `Demonstracao-Estoque.bat` | Mesma demo, com terminal visível |
| `Encerrar-Estoque.bat` | Encerra o servidor ao terminar |

- URL: `http://localhost:3456`
- **Não** abra `dist/index.html` direto — tela branca no Chrome.

Após alterar o código: rode `npm run build:demo` ou deixe o `.vbs` gerar na primeira abertura.

Variáveis de ambiente: copiar `.env.example` para `.env` (opcional em dev).

---

## Arquitetura

### Camadas (Phase 2 — Clean Code)

```
┌─────────────────────────────────────────────────────────┐
│  views/          Telas e fluxo do usuário               │
├─────────────────────────────────────────────────────────┤
│  components/     UI reutilizável (tabela, botões, etc.) │
├─────────────────────────────────────────────────────────┤
│  services/       estoqueService.js  ← uso atual           │
│                  api.js           ← HTTP futuro         │
├─────────────────────────────────────────────────────────┤
│  domain/         Regras puras (quantidade, validações)  │
├─────────────────────────────────────────────────────────┤
│  data/           Seeds estáticos (produtos, unidades)    │
└─────────────────────────────────────────────────────────┘
```

**Regra:** views **não** acessam `localStorage` diretamente. Toda mutação passa por `estoqueService.js`. Validações de quantidade/categoria ficam em `domain/estoque.js`.

### Estrutura de pastas

```
src/
├── App.jsx                    # BrowserRouter + rotas
├── routes.jsx                 # rotasModuloEstoque (exportável para app pai)
├── main.jsx
├── index.css                  # Design tokens (sidebar, cores LA)
├── config/
│   └── plataforma.js          # Módulo, base path, contrato API
├── integracao/
│   └── plataformaAuth.js      # JWT / perfil via window.__PLATAFORMA__
├── domain/
│   └── estoque.js             # Categorias, parse, validações
├── data/
│   ├── produtosIniciais.js    # Catálogo seed
│   ├── unidades.js            # Lojas destino
│   └── localizacoesSugeridas.js
├── services/
│   ├── estoqueService.js      # ★ Lógica + localStorage
│   └── api.js                 # fetch para backend (não usado nas telas hoje)
├── components/                # Button, ProductsTable, CampoLocalizacao…
│   └── layout/                # AppShell, Sidebar, TopBar, PageHeader
└── views/                     # Uma view por rota principal
```

---

## Modelo de dados

### Produto (`la-estoque-produtos`)

Array JSON no localStorage. Campos:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string | Código numérico gerado (ex.: `"1032"`) |
| `nome` | string | Descrição comercial |
| `referencia` | string | Código interno (ex.: `PPF-TRANSP`) |
| `categoria` | `"pelicula"` \| `"quimico"` \| `"acessorio"` | Define unidade e decimais |
| `marca` | string | Fabricante |
| `localizacao` | string | Endereço físico no central (ex.: `A2 — Corredor películas`) |
| `saldo` | number | Quantidade atual **apenas no estoque central** |
| `imagemUrl` | string \| null | Reservado para fotos (não implementado na UI) |

### Movimento (`la-estoque-movimentos`)

Cada registro append no início da lista:

| Campo comum | Tipo | Descrição |
|-------------|------|-----------|
| `id` | string (UUID) | Identificador do movimento |
| `criadoEm` | string (ISO 8601) | Data/hora |
| `tipo` | string | Ver tabela abaixo |
| `produtoId` | string | Produto afetado |
| `observacao` | string | Opcional |

**Tipos de movimento:**

| `tipo` | Efeito no saldo central | Campos extras |
|--------|-------------------------|---------------|
| `entrada` | **Soma** `quantidade` | `quantidade` |
| `saida` | **Subtrai** `quantidade` | `quantidade`, `veiculo` |
| `estoque_atual` | **Substitui** saldo | `saldoAnterior`, `saldoNovo`, `quantidade` (delta) |
| `envio_unidade` | **Subtrai** `quantidade` | `unidadeId`, `unidadeNome`, `produtoNome`, `produtoReferencia`, `produtoCategoria`, `quantidade` |
| `pedido_reposicao` | **Nenhum** (só histórico) | `quantidade`, `produtoNome`, `status: "pendente"` |
| `localizacao` | **Nenhum** | `localizacaoAnterior`, `localizacaoNova`, `produtoNome` |

> **Importante:** `pedido_reposicao` e `localizacao` não alteram saldo. `estoque_atual` **não soma** — define o valor real (inventário).

### Sincronização com seed

Ao ler produtos, `sincronizarComCatalogoInicial()` mescla `produtosIniciais.js` com dados salvos: preserva `saldo` do usuário, preenche `marca`/`localizacao` vazios a partir do seed e adiciona produtos novos do seed.

---

## Regras de negócio (`domain/estoque.js`)

### Categorias e unidades

| `categoria` | Label | Unidade | Decimais |
|-------------|-------|---------|----------|
| `pelicula` | Película / PPF | **m** | Sim (ex.: 1,5 m) |
| `quimico` | Químico | **L** | Sim |
| `acessorio` | Acessório | **un** | Não (somente inteiros) |

### Parsing de quantidade

- Entrada do usuário aceita vírgula ou ponto: `"1,5"` → `1.5`.
- `interpretarQuantidade`: usado em chegada, saída, envio, reposição — **rejeita** ≤ 0 e decimais em acessório.
- `interpretarSaldoInventario`: aceita **zero** (prateleira vazia) e decimais conforme categoria.

### Validação de saldo

`validarSaldoSuficiente(saldoAtual, quantidade)` → mensagem **"Saldo insuficiente."** (usada em saída e envio para unidade).

### Cadastro

`validarCadastroProduto`: exige `nome`, `referencia` e `categoria` válida.

---

## API do serviço (`estoqueService.js`)

Funções públicas que as views devem usar:

| Função | Descrição |
|--------|-----------|
| `listarProdutos()` | Lista completa |
| `buscarProdutos(filtro?)` | Filtro por id, nome ou referência (case insensitive) |
| `buscarProdutoPorId(id)` | Um produto ou `null` |
| `obterResumoEstoque()` | `{ total, comEstoque, semEstoque }` |
| `cadastrarProduto({...})` | Cria produto; opcional `saldoInicial` via `definirSaldoAtual` |
| `registrarChegadaDeMaterial({ produtoId, quantidade, observacao })` | Entrada — **soma** saldo |
| `definirSaldoAtual({ produtoId, saldoNovo, observacao })` | Inventário — **substitui** saldo |
| `registrarSaidaDeMaterial({ produtoId, quantidade, veiculo, observacao })` | Saída — **subtrai**; valida saldo |
| `registrarEnvioParaUnidade({ unidadeId, produtoId, quantidade, observacao })` | Envio — **subtrai** central; grava destino |
| `registrarPedidoReposicao({ produtoId, quantidade, observacao })` | Apenas movimento `pedido_reposicao` |
| `atualizarLocalizacaoProduto({ produtoId, localizacao, observacao })` | Atualiza `localizacao` + movimento |
| `listarAuditoriaEnviosUnidade()` | Linhas de auditoria (envios), mais recente primeiro |
| `obterResumoEnviosPorUnidade()` | Totais agregados por unidade e produto |

**Erros:** funções lançam `Error` com mensagem em português para exibir na UI (`AlertMessage`).

---

## Rotas e telas

Base path configurável via `VITE_BASE_PATH` (padrão `/`). Definição em `src/routes.jsx`.

| Rota | View | Função |
|------|------|--------|
| `/` | `HomeView` | KPIs, tabela de produtos, card envios por unidade |
| `/chegada` | `ChegadaView` | Entrada de material (produto → quantidade) |
| `/inventario` | `InventarioView` | Definir saldo real (substitui) |
| `/envio-unidade` | `EnvioUnidadeView` | Unidade → produto → quantidade |
| `/relatorio/envios` | `RelatorioEnviosView` | Totais enviados por loja |
| `/auditoria/envios` | `AuditoriaEnviosView` | Tabela: data/hora, produto, qtd, destino |
| `/saida` | `SaidaView` | Veículo → produto → quantidade |
| `/produtos/novo` | `NovoProdutoView` | Cadastro + saldo inicial opcional |
| `/produtos/localizacao` | `LocalizacaoProdutoView` | Alterar endereço físico (`?produto=ID`) |
| `/solicitacao-reposicao` | `PedidoReposicaoView` | Pedido quando em ruptura (`?produto=ID`) |

### Layout

- **Standalone** (`VITE_MODO_EMBEDDED=false`): `Sidebar` + `TopBar` + conteúdo.
- **Embutido** (`true`): apenas `Outlet` — o app pai fornece chrome e auth.

### Home — filtros

- `/?estoque=critico` — mostra só produtos com `saldo <= 0`.
- Coluna **Localização** clicável → `/produtos/localizacao?produto=…`
- Saldo zero → badge **Em ruptura** + botão **Solicitar reposição**

---

## Integração com a plataforma principal

Antes de montar o módulo, o app pai deve definir:

```js
window.__PLATAFORMA__ = {
  token: '<JWT>',
  perfil: 'gerente', // ou 'aplicador'
  unidadeId: 'lacustom-central',
}
```

| Arquivo | Responsabilidade |
|---------|------------------|
| `plataformaAuth.js` | `obterTokenAutenticacao()`, `obterHeadersAutenticados()`, `obterPerfilUsuario()` |
| `routes.jsx` | `rotasModuloEstoque` para `<Route path="/estoque/*" …>` |
| `plataforma.js` | `moduloId`, `basePath`, `contratoApi` |

**Perfil `aplicador` (planejado):** restringir UI à saída — função `obterPerfilUsuario()` já existe; restrição de menu ainda não aplicada em todas as rotas.

**Montagem sugerida no router pai:**

```jsx
import { rotasModuloEstoque } from '@la-custom/modulo-estoque/routes'

<Route path="/estoque/*" element={<ModuloEstoqueShell />}>
  {rotasModuloEstoque.map(/* index + path */)}
</Route>
```

---

## Contrato API futuro (backend)

Hoje as telas usam **`estoqueService.js`**, não `api.js`. Ao existir backend, substituir implementação mantendo as mesmas regras de `domain/`.

Endpoints previstos (`contratoApi` + `api.js`):

| Método | Path | Uso |
|--------|------|-----|
| GET | `/produtos` | Listar catálogo |
| POST | `/produtos` | Criar produto |
| POST | `/movimentacoes/entrada` | Chegada |
| POST | `/movimentacoes/saida` | Consumo |
| POST | `/movimentacoes/estoque-atual` | Inventário |
| POST | `/movimentacoes/envio-unidade` | Distribuição |
| GET | `/unidades` | Lojas |
| GET | `/veiculos` | Opcional para saída |

Auth: header `Authorization: Bearer <token>`.

**Payload sugerido — envio unidade:**

```json
{
  "unidadeId": "porsche-rio",
  "produtoId": "1032",
  "quantidade": 12.5,
  "observacao": ""
}
```

**Payload sugerido — saída:**

```json
{
  "produtoId": "1032",
  "quantidade": 1.5,
  "veiculo": "Porsche 911 - ABC1D23",
  "observacao": ""
}
```

---

## Persistência local (desenvolvimento)

| Chave localStorage | Conteúdo |
|--------------------|----------|
| `la-estoque-produtos` | `Produto[]` |
| `la-estoque-movimentos` | `Movimento[]` (mais recente no índice 0) |

Para resetar dados de dev no browser: Application → Local Storage → apagar as chaves acima.

---

## UI e design

- Fonte: **Inter**
- Sidebar escura (`#071018`), conteúdo claro (`#eef2f6`)
- Ações: verde **entrada**, vermelho **saída**, azul **primário** (LA)
- Mensagens de erro amigáveis: **"Saldo insuficiente."**, sem stack trace na tela

---

## O que não está implementado (escopo futuro)

- Banco de dados e API real em produção
- Troca de `estoqueService` → `api.js` nas views
- Estoque **por unidade** (saldo na loja após envio)
- Upload de **fotos** de produtos
- Fornecedores na chegada
- NF-e / entrada XML
- Controle de permissões completo por perfil na UI
- Testes automatizados (`domain/` é prioridade)
- OpenAPI/Swagger publicado

---

## Checklist para o próximo desenvolvedor

1. Ler este README e `domain/estoque.js`.
2. Rodar `npm run dev` e percorrer: chegada → envio → auditoria → saída.
3. Implementar backend espelhando `estoqueService` + tipos de movimento.
4. Trocar chamadas nas views de `estoqueService` para `api.js` (ou adapter).
5. Validar integração com `window.__PLATAFORMA__` e `VITE_MODO_EMBEDDED=true`.
6. Adicionar testes unitários em `validarSaldoSuficiente`, `interpretarQuantidade`, etc.

---

## Licença e propriedade

Projeto privado **LA Custom**. Uso interno.
