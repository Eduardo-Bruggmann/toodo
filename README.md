# TooDo

Aplicação web de lista de tarefas construída com **Vite + JavaScript + jQuery + Tailwind CSS**.

O projeto permite adicionar, visualizar, editar, concluir e remover tarefas, além de gerenciar uma descrição para cada item.

## Funcionalidades

- Adição de tarefas com título e descrição obrigatória
- Lista renderizada dinamicamente com jQuery
- Edição inline da tarefa e da descrição
- Exibição e ocultação da descrição por tarefa
- Marcação de tarefas como concluídas
- Remoção de tarefas
- Atualização automática da interface a cada alteração no array

## Tecnologias

- [Vite](https://vitejs.dev/)
- JavaScript (ES Modules)
- [jQuery](https://jquery.com/)
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

## Estrutura dos dados

As tarefas são armazenadas em memória em um array de objetos com esta estrutura:

```json
[
  {
    "text": "Exemplo de tarefa",
    "description": "Descrição da tarefa",
    "completed": false
  }
]
```

## Estrutura do projeto

- [index.html](index.html)
- [src/main.js](src/main.js)
- [src/style.css](src/style.css)

## Melhorias futuras (sugestões)

- Persistência com `localStorage`
- Filtro e busca de tarefas
- Tema claro/escuro
- Exportar e importar tarefas em arquivo JSON
