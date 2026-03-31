import Card from './Card'

let tasks = []
let nextTaskId = 1

function renderTasks() {
  const todoList = document.getElementById('todo-list')
  const inProgressList = document.getElementById('in-progress-list')
  const doneList = document.getElementById('done-list')

  if (!todoList || !inProgressList || !doneList) return

  const todoTasks = tasks.filter(task => task.status === 'todo')
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress')
  const doneTasks = tasks.filter(task => task.status === 'done')

  todoList.innerHTML = todoTasks.length
    ? todoTasks.map(task => Card(task)).join('')
    : '<p class="px-3 py-4 rounded-lg border border-dashed border-[#374151] text-sm text-[#9CA3AF]">Nenhuma tarefa.</p>'

  inProgressList.innerHTML = inProgressTasks.length
    ? inProgressTasks.map(task => Card(task)).join('')
    : '<p class="px-3 py-4 rounded-lg border border-dashed border-[#374151] text-sm text-[#9CA3AF]">Nenhuma tarefa.</p>'
  doneList.innerHTML = doneTasks.length
    ? doneTasks.map(task => Card(task)).join('')
    : '<p class="px-3 py-4 rounded-lg border border-dashed border-[#374151] text-sm text-[#9CA3AF]">Nenhuma tarefa.</p>'

  const todoCount = document.getElementById('todo-count')
  const inProgressCount = document.getElementById('in-progress-count')
  const doneCount = document.getElementById('done-count')

  if (todoCount) todoCount.textContent = String(todoTasks.length)
  if (inProgressCount)
    inProgressCount.textContent = String(inProgressTasks.length)
  if (doneCount) doneCount.textContent = String(doneTasks.length)
}

export function initKanban() {
  const modal = document.getElementById('task-modal')
  const openModalButton = document.getElementById('open-task-modal')
  const closeModalButton = document.getElementById('close-task-modal')
  const cancelModalButton = document.getElementById('cancel-task-modal')
  const taskForm = document.getElementById('task-form')
  const board = document.getElementById('kanban-board')

  if (
    !modal ||
    !openModalButton ||
    !closeModalButton ||
    !cancelModalButton ||
    !taskForm ||
    !board
  ) {
    return
  }

  const openModal = () => {
    modal.classList.remove('hidden')
  }

  const closeModal = () => {
    modal.classList.add('hidden')
  }

  openModalButton.addEventListener('click', openModal)
  closeModalButton.addEventListener('click', closeModal)
  cancelModalButton.addEventListener('click', closeModal)

  modal.addEventListener('click', event => {
    if (event.target === modal) {
      closeModal()
    }
  })

  taskForm.addEventListener('submit', event => {
    event.preventDefault()

    const titleInput = document.getElementById('task-title')
    const descriptionInput = document.getElementById('task-description')
    const statusInput = document.getElementById('task-status')

    if (!titleInput || !descriptionInput || !statusInput) {
      return
    }

    const title = titleInput.value.trim()
    const description = descriptionInput.value.trim()
    const status = statusInput.value

    if (!title) {
      return
    }

    tasks.push({
      id: nextTaskId++,
      title,
      description,
      status,
    })

    taskForm.reset()
    closeModal()
    renderTasks()
  })

  board.addEventListener('click', event => {
    const button = event.target.closest('[data-delete-task]')

    if (!button) {
      return
    }

    const taskId = Number(button.getAttribute('data-delete-task'))
    tasks = tasks.filter(task => task.id !== taskId)
    renderTasks()
  })

  renderTasks()
}

export default function Main() {
  return `
    <main class="flex flex-1 flex-col items-center w-full gap-6 p-6 md:p-8 bg-[#111827]">
      <div class="flex items-center justify-between w-full max-w-6xl gap-4">
        <div>
          <h1 class="text-2xl text-[#F9FAFB] font-extrabold">Gerenciador de Tarefas Kanban</h1>
          <p class="mt-1 text-sm text-[#9CA3AF]">Organize tarefas em 3 etapas: A Fazer, Em Andamento e Concluído.</p>
        </div>

        <button
          id="open-task-modal"
          type="button"
          class="px-4 py-2 rounded-lg border border-[#6366F1]/60 bg-[#6366F1]/20 text-sm text-[#E0E7FF] font-semibold transition hover:bg-[#6366F1]/30"
        >
          + Adicionar tarefa
        </button>
      </div>

      <div id="kanban-board" class="grid grid-cols-1 md:grid-cols-3 w-full max-w-6xl gap-4">
        <section class="flex flex-col min-h-90 p-4 rounded-xl border border-[#374151] bg-[#111827]">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-base text-[#F9FAFB] font-bold">A Fazer</h2>
            <span id="todo-count" class="px-2.5 py-1 rounded-full border text-xs text-slate-200 font-semibold bg-slate-500/20 border-slate-400/40">0</span>
          </div>
          <div id="todo-list" class="flex flex-1 flex-col gap-3"></div>
        </section>

        <section class="flex flex-col min-h-90 p-4 rounded-xl border border-[#374151] bg-[#111827]">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-base text-[#F9FAFB] font-bold">Em Andamento</h2>
            <span id="in-progress-count" class="px-2.5 py-1 rounded-full border text-xs text-amber-200 font-semibold bg-amber-500/20 border-amber-400/40">0</span>
          </div>
          <div id="in-progress-list" class="flex flex-1 flex-col gap-3"></div>
        </section>

        <section class="flex flex-col min-h-90 p-4 rounded-xl border border-[#374151] bg-[#111827]">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-base text-[#F9FAFB] font-bold">Concluído</h2>
            <span id="done-count" class="px-2.5 py-1 rounded-full border text-xs text-emerald-200 font-semibold bg-emerald-500/20 border-emerald-400/40">0</span>
          </div>
          <div id="done-list" class="flex flex-1 flex-col gap-3"></div>
        </section>
      </div>

      <div id="task-modal" class="fixed inset-0 z-50 hidden bg-black/60 p-4">
        <div class="w-full max-w-md mx-auto mt-20 p-5 rounded-xl border border-[#374151] bg-[#111827] shadow-2xl">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg text-[#F9FAFB] font-bold">Nova tarefa</h3>
            <button
              id="close-task-modal"
              type="button"
              class="px-2 py-1 rounded-md border border-[#4B5563] text-sm text-[#D1D5DB] transition hover:bg-[#1F2937]"
            >
              Fechar
            </button>
          </div>

          <form id="task-form" class="space-y-4">
            <div>
              <label for="task-title" class="block mb-1 text-sm text-[#E5E7EB] font-semibold">Título</label>
              <input
                id="task-title"
                name="title"
                type="text"
                required
                class="w-full px-3 py-2 rounded-lg border border-[#4B5563] bg-[#1F2937] text-sm text-[#F9FAFB] focus:border-[#6366F1] outline-none"
                placeholder="Ex.: Revisar relatório"
              />
            </div>

            <div>
              <label for="task-description" class="mb-1 block text-sm text-[#E5E7EB] font-semibold">Descrição</label>
              <textarea
                id="task-description"
                name="description"
                rows="3"
                class="w-full px-3 py-2 rounded-lg border border-[#4B5563] bg-[#1F2937] text-sm text-[#F9FAFB] focus:border-[#6366F1] outline-none"
                placeholder="Detalhes da tarefa"
              ></textarea>
            </div>

            <div>
              <label for="task-status" class="mb-1 block text-sm text-[#E5E7EB] font-semibold">Coluna</label>
              <select
                id="task-status"
                name="status"
                class="w-full px-3 py-2 rounded-lg border border-[#4B5563] bg-[#1F2937] text-sm text-[#F9FAFB] focus:border-[#6366F1] outline-none"
              >
                <option value="todo">A Fazer</option>
                <option value="in-progress">Em Andamento</option>
                <option value="done">Concluído</option>
              </select>
            </div>

            <div class="flex justify-end gap-2">
              <button
                id="cancel-task-modal"
                type="button"
                class="px-4 py-2 rounded-lg border border-[#4B5563] text-sm text-[#D1D5DB] font-semibold transition hover:bg-[#1F2937]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="px-4 py-2 rounded-lg border border-[#6366F1]/60 bg-[#6366F1]/20  text-sm text-[#E0E7FF] font-semibold transition hover:bg-[#6366F1]/30"
              >
                Salvar tarefa
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  `
}
