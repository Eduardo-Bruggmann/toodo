# Focus - Gerenciador de Tarefas Kanban

Aplicação web de gerenciamento de tarefas em estilo **Kanban**, construída com **Vite + JavaScript + Tailwind CSS**.

O projeto permite criar, editar, excluir e mover tarefas entre colunas com **arrastar e soltar**.

## Funcionalidades

- 3 colunas fixas do Kanban:
  - **A Fazer**
  - **Em Andamento**
  - **Concluído**
- Criação de tarefas via modal
- Edição de tarefas existentes
- Exclusão de tarefas
- Drag-and-drop para mover tarefas entre colunas
- Persistência local em JSON usando `localStorage`
- Contador automático por coluna

## Tecnologias

- [Vite](https://vitejs.dev/)
- JavaScript (ES Modules)
- [Tailwind CSS v4](https://tailwindcss.com/)

## Como executar localmente

### Pré-requisitos

- Node.js (recomendado: versão LTS)
- npm

### Instalação

1. Instale as dependências:

```bash
npm install
```

2. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

3. Abra no navegador o endereço exibido no terminal (geralmente `http://localhost:5173`).

## Scripts disponíveis

- `npm run dev`: inicia em modo desenvolvimento
- `npm run build`: gera build de produção
- `npm run preview`: pré-visualiza o build de produção

## Persistência dos dados

As tarefas são salvas no navegador usando `localStorage`, na chave:

- `kanban_tasks`

Formato (JSON):

```json
[
  {
    "id": 1,
    "title": "Exemplo",
    "description": "Descrição da tarefa",
    "status": "todo"
  }
]
```

Status possíveis:

- `todo`
- `in-progress`
- `done`

## Estrutura do projeto

- [index.html](index.html)
- [src/main.js](src/main.js)
- [src/style.css](src/style.css)
- [src/components/Header.js](src/components/Header.js)
- [src/components/Main.js](src/components/Main.js)
- [src/components/Card.js](src/components/Card.js)
- [src/components/Footer.js](src/components/Footer.js)

## Melhorias futuras (sugestões)

- Ordenação de cards dentro da mesma coluna
- Filtro e busca de tarefas
- Tema claro/escuro
- Exportar e importar tarefas em arquivo JSON
- Sincronização com backend
