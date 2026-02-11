# Mini CRM de Leads

Aplicação fullstack para gerenciamento de **leads** e **contatos**, composta por uma API REST e uma interface web.

## Tecnologias Utilizadas

**Backend:**
- Hono
- TypeScript
- Zod
- Node.js

**Frontend:**
- React
- TypeScript
- Tailwind CSS
- Vite

**Testes:**
- Vitest
- Testing Library (React)

**Infraestrutura:**
- Docker (multi-stage builds)
- Nginx (servir frontend)

## Estrutura do Projeto

```
crm/
├── api/                          # Backend
│   ├── Dockerfile
│   └── src/
│       ├── __tests__/            # Testes unitários e de integração
│       │   ├── repositories/
│       │   ├── routes/
│       │   ├── schemas/
│       │   └── utils/
│       ├── middlewares/          # Error handler global
│       ├── repositories/         # Acesso aos dados (in-memory)
│       ├── routes/               # Endpoints REST
│       │   ├── contacts/         # Um handler por operação (SRP)
│       │   └── leads/
│       ├── schemas/              # Validações com Zod
│       ├── types/                # Interfaces e tipos compartilhados
│       ├── utils/                # Utilitários (paginação, ordenação)
│       ├── seed.ts               # Dados iniciais
│       ├── app.ts                # Configuração do Hono (usado nos testes)
│       └── index.ts              # Entry point
├── web/                          # Frontend
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
│       ├── __tests__/            # Testes de componentes, hooks, utils
│       │   ├── components/
│       │   ├── constants/
│       │   ├── hooks/
│       │   └── utils/
│       ├── components/           # Componentes reutilizáveis
│       ├── constants/            # Constantes compartilhadas
│       ├── hooks/                # Custom hooks (lógica de negócio)
│       ├── pages/                # Páginas da aplicação
│       ├── services/             # Comunicação com a API
│       ├── types/                # Interfaces e tipos
│       └── utils/                # Utilitários (máscaras)
├── docker-compose.yml
└── README.md
```

## Decisões Técnicas

### Arquitetura do Backend
Cada rota é isolada em seu próprio arquivo seguindo o **Single Responsibility Principle**. A separação em camadas (routes → repositories → schemas) facilita a manutenção e testabilidade. O `app.ts` é extraído do `index.ts` para permitir testes de integração sem subir o servidor.

### Validação
Zod como validador centralizado nos schemas, com mensagens de erro em português. Validação de telefone via regex aceita formatos comuns brasileiros. O schema de update reaproveita o de criação com `.partial()`, evitando duplicação.

### Paginação e Ordenação
Extraídos em uma função utilitária genérica (`paginate<T>`) que aceita campos permitidos para ordenação, evitando duplicação entre endpoints e validando campos inválidos.

### Tipos
O backend define `Lead` e `Contact` como tipos base. O frontend estende com `LeadWithContact` (lead enriquecido com dados do contato na listagem) e `PaginatedResponse<T>` genérico para respostas paginadas.

### Frontend
- **Custom Hooks** (`useContacts`, `useLeads`): encapsulam toda a lógica de estado e comunicação com API, mantendo as páginas focadas apenas em renderização
- **AbortController**: requests em andamento são cancelados quando filtros mudam, evitando race conditions
- **Debounce** na busca para evitar requisições excessivas
- **Services separados** por entidade para facilitar testes e manutenção
- **Componentes reutilizáveis**: `Pagination`, `SortableHeader`, `ConfirmDialog`, `ErrorBoundary`
- **Máscara de telefone** no input para melhor UX
- **Validação de ambiente**: fail-fast se `VITE_API_URL` não estiver definida

### Error Handling
- **Backend**: middleware global captura exceções e retorna 500 com mensagem genérica. Erros de JSON inválido retornam 400.
- **Frontend**: `ErrorBoundary` captura erros de renderização. O service layer trata respostas não-JSON (ex: erro 502) sem crashar. Erros de validação do Zod são exibidos como mensagens legíveis em português.

### Docker
Multi-stage builds para ambos os serviços. O backend compila TypeScript e roda com `node` em produção (sem devDependencies). O frontend builda com Vite e serve estáticos via nginx:alpine. `.dockerignore` exclui `node_modules` e `dist` do contexto de build.

## Funcionalidades

### Obrigatórios
- Listagem de leads e contatos em tabela
- Busca por nome/empresa (leads) e nome/email (contatos)
- Filtro de leads por status
- Formulários de criação de leads e contatos
- Visualização dos leads vinculados a um contato
- Feedback visual de loading e erro

### Diferenciais Implementados
- Paginação nas listagens
- Edição de leads e contatos
- Remoção com confirmação
- Ordenação por nome ou data
- Testes unitários e de integração (121 testes)
- Responsividade
- Seed data para facilitar avaliação
- Máscara e validação de telefone
- Debounce na busca
- Nome do contato exibido na listagem de leads
- Docker com multi-stage builds
- Cancelamento de requests com AbortController
- Validação de variáveis de ambiente
- Error boundary global

## Como Rodar

### Com Docker (recomendado)

```bash
docker compose up
```

- API: `http://localhost:3001`
- Frontend: `http://localhost:8080`

### Sem Docker

**Pré-requisitos:** Node.js 18+

**Backend:**

```bash
cd crm/api
npm install
npm run dev
```

A API estará disponível em `http://localhost:3001`.

**Frontend:**

```bash
cd crm/web
npm install
cp .env.example .env
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

### Testes

```bash
cd crm/api
npm test

cd crm/web
npm test
```

## Endpoints da API

### Contatos

| Método | Endpoint                      | Descrição                        |
|--------|-------------------------------|----------------------------------|
| GET    | /contacts                     | Listar contatos (com paginação)  |
| POST   | /contacts                     | Criar contato                    |
| PATCH  | /contacts/:id                 | Atualizar contato (parcial)      |
| DELETE | /contacts/:id                 | Remover contato                  |
| GET    | /contacts/:contactId/leads    | Listar leads de um contato       |

### Leads

| Método | Endpoint                      | Descrição                        |
|--------|-------------------------------|----------------------------------|
| GET    | /leads                        | Listar leads (com paginação)     |
| POST   | /leads                        | Criar lead                       |
| PATCH  | /leads/:id                    | Atualizar lead (parcial)         |
| DELETE | /leads/:id                    | Remover lead                     |

### Query Params

| Param     | Endpoints             | Descrição                                                              |
|-----------|-----------------------|------------------------------------------------------------------------|
| search    | GET /contacts         | Filtra por nome ou email                                               |
| search    | GET /leads            | Filtra por nome ou empresa                                             |
| status    | GET /leads            | Filtra por status (novo, contactado, qualificado, convertido, perdido) |
| sortBy    | GET /contacts, /leads | Ordena por campo (name, createdAt)                                     |
| sortOrder | GET /contacts, /leads | Direção da ordenação (asc, desc)                                       |
| page      | GET /contacts, /leads | Número da página (padrão: 1)                                           |
| limit     | GET /contacts, /leads | Itens por página (padrão: 10, máximo: 50)                              |

## Testes

**Backend** – 87 testes:

- **Rotas (integração)**: CRUD completo via HTTP, validação, cascade delete, enriquecimento de dados, busca, filtros, paginação e ordenação
- **Repositories**: CRUD, busca, filtros combinados, clear
- **Schemas**: Validação de campos, formatos, parcialidade no update
- **Paginação**: Limites, ordenação, campos inválidos

**Frontend** – 34 testes:

- **Componentes**: ConfirmDialog (render, interações, acessibilidade), Pagination (navegação, estados), SortableHeader (indicadores visuais)
- **Hooks**: comportamento assíncrono e controle de estado (useDebounce)
- **Utils**: funções puras e regras de formatação (phoneMask)
- **Constantes**: consistência entre estados, labels e cores de domínio
