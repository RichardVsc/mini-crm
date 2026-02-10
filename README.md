# Mini CRM de Leads

Aplicação fullstack para gerenciamento de **leads** e **contatos**, composta por uma API REST e uma interface web.

## 🧑‍💻 Tecnologias Utilizadas

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

## 📁 Estrutura do Projeto

```
crm/
├── api/                          # Backend
│   └── src/
│       ├── __tests__/            # Testes unitários
│       │   ├── repositories/
│       │   ├── schemas/
│       │   └── utils/
│       ├── repositories/         # Acesso aos dados (in-memory)
│       ├── routes/               # Endpoints REST
│       │   ├── contacts/         # Um handler por operação (SRP)
│       │   └── leads/
│       ├── schemas/              # Validações com Zod
│       ├── types/                # Interfaces e tipos compartilhados
│       ├── utils/                # Utilitários (paginação, ordenação)
│       ├── seed.ts               # Dados iniciais
│       └── index.ts              # Entry point
├── web/                          # Frontend
│   └── src/
│       ├── components/           # Componentes reutilizáveis
│       ├── constants/            # Constantes compartilhadas
│       ├── hooks/                # Custom hooks (lógica de negócio)
│       ├── pages/                # Páginas da aplicação
│       ├── services/             # Comunicação com a API
│       ├── types/                # Interfaces e tipos
│       └── utils/                # Utilitários (máscaras)
└── README.md
```

## 🎯 Decisões Técnicas

### Arquitetura do Backend
Cada rota é isolada em seu próprio arquivo seguindo o **Single Responsibility Principle**. A separação em camadas (routes → repositories → schemas) facilita a manutenção e testabilidade, mesmo com persistência em memória.

### Validação
Zod como validador centralizado nos schemas, com mensagens de erro em português. Validação de telefone via regex aceita formatos comuns brasileiros. O schema de update reaproveita o de criação com `.partial()`, evitando duplicação.

### Paginação e Ordenação
Extraídos em uma função utilitária genérica (`paginate`) que aceita campos permitidos para ordenação, evitando duplicação entre endpoints e validando campos inválidos.

### Frontend
- **Custom Hooks** (`useContacts`, `useLeads`): encapsulam toda a lógica de estado e comunicação com API, mantendo as páginas focadas apenas em renderização
- **Debounce** na busca para evitar requisições excessivas
- **Services separados** por entidade para facilitar testes e manutenção
- **Componentes reutilizáveis**: `Pagination`, `SortableHeader`
- **Máscara de telefone** no input para melhor UX

## 📋 Funcionalidades

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
- Testes unitários (repositories, schemas, paginação)
- Responsividade
- Seed data para facilitar avaliação
- Máscara e validação de telefone
- Debounce na busca
- Nome do contato exibido na listagem de leads

## 🚀 Como Rodar

### Pré-requisitos
- Node.js 18+

### Backend

```bash
cd crm/api
npm install
npm run dev
```

A API estará disponível em `http://localhost:3001`.

### Frontend

```bash
cd crm/web
npm install
```

Crie o arquivo `.env` baseado no `.env.example`:

```bash
cp .env.example .env
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

### Testes

```bash
cd crm/api
npm test
```

## 📦 Endpoints da API

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

## 🧪 Testes

Backend – 55 testes unitários cobrindo:

- **Repositories**: CRUD completo, busca, filtros
- **Schemas**: Validação de campos, formatos, parcialidade no update
- **Paginação**: Limites, ordenação, campos inválidos

Frontend – 12 testes unitários cobrindo:

- **Hooks**: comportamento assíncrono e controle de estado (useDebounce)
- **Utils**: funções puras e regras de formatação (phoneMask)
- **Constantes**: consistência entre estados, labels e cores de domínio
