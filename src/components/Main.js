import Card from './Card'

const TASKS_STORAGE_KEY = 'kanban_tasks'

function loadTasks() {
  try {
    const rawTasks = localStorage.getItem(TASKS_STORAGE_KEY)

    if (!rawTasks) {
      return []
    }

    const parsedTasks = JSON.parse(rawTasks)
    return Array.isArray(parsedTasks) ? parsedTasks : []
  } catch {
    return []
  }
}

function saveTasks() {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
}

let tasks = loadTasks()
let nextTaskId = 1

function syncNextTaskId() {
  const maxTaskId = tasks.reduce(
    (maxId, task) => Math.max(maxId, Number(task.id) || 0),
    0,
  )
  nextTaskId = maxTaskId + 1
}

syncNextTaskId()

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
  const taskModalTitle = document.getElementById('task-modal-title')
  const taskSubmitButton = document.getElementById('task-submit-button')
  const titleInput = document.getElementById('task-title')
  const descriptionInput = document.getElementById('task-description')
  const statusInput = document.getElementById('task-status')
  const board = document.getElementById('kanban-board')

  if (
    !modal ||
    !openModalButton ||
    !closeModalButton ||
    !cancelModalButton ||
    !taskForm ||
    !taskModalTitle ||
    !taskSubmitButton ||
    !titleInput ||
    !descriptionInput ||
    !statusInput ||
    !board
  ) {
    return
  }

  let editingTaskId = null

  const setCreateMode = () => {
    editingTaskId = null
    taskModalTitle.textContent = 'Nova tarefa'
    taskSubmitButton.textContent = 'Salvar tarefa'
    taskForm.reset()
    statusInput.value = 'todo'
  }

  const setEditMode = task => {
    editingTaskId = task.id
    taskModalTitle.textContent = 'Editar tarefa'
    taskSubmitButton.textContent = 'Salvar alterações'
    titleInput.value = task.title
    descriptionInput.value = task.description || ''
    statusInput.value = task.status
  }

  const openModal = () => {
    modal.classList.remove('hidden')
  }

  const closeModal = () => {
    modal.classList.add('hidden')
    setCreateMode()
  }

  let draggedTaskId = null

  openModalButton.addEventListener('click', () => {
    setCreateMode()
    openModal()
  })
  closeModalButton.addEventListener('click', closeModal)
  cancelModalButton.addEventListener('click', closeModal)

  modal.addEventListener('click', event => {
    if (event.target === modal) {
      closeModal()
    }
  })

  taskForm.addEventListener('submit', event => {
    event.preventDefault()

    const title = titleInput.value.trim()
    const description = descriptionInput.value.trim()
    const status = statusInput.value

    if (!title) {
      return
    }

    if (editingTaskId) {
      tasks = tasks.map(task =>
        task.id === editingTaskId
          ? { ...task, title, description, status }
          : task,
      )
    } else {
      tasks.push({
        id: nextTaskId++,
        title,
        description,
        status,
      })
    }

    saveTasks()
    closeModal()
    renderTasks()
  })

  board.addEventListener('click', event => {
    const editButton = event.target.closest('[data-edit-task]')
    if (editButton) {
      const taskId = Number(editButton.getAttribute('data-edit-task'))
      const task = tasks.find(currentTask => currentTask.id === taskId)

      if (task) {
        setEditMode(task)
        openModal()
      }
      return
    }

    const button = event.target.closest('[data-delete-task]')

    if (!button) {
      return
    }

    const taskId = Number(button.getAttribute('data-delete-task'))
    tasks = tasks.filter(task => task.id !== taskId)
    saveTasks()
    renderTasks()
  })

  board.addEventListener('dragstart', event => {
    const card = event.target.closest('[data-task-id]')

    if (!card) {
      return
    }

    draggedTaskId = Number(card.getAttribute('data-task-id'))
    card.classList.add('opacity-50')

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', String(draggedTaskId))
    }
  })

  board.addEventListener('dragend', event => {
    const card = event.target.closest('[data-task-id]')

    if (card) {
      card.classList.remove('opacity-50')
    }

    draggedTaskId = null
    document.querySelectorAll('[data-dropzone]').forEach(zone => {
      zone.classList.remove('ring-2', 'ring-[#6366F1]/70', 'bg-[#1F2937]/70')
    })
  })

  document.querySelectorAll('[data-dropzone]').forEach(zone => {
    zone.addEventListener('dragover', event => {
      event.preventDefault()

      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move'
      }
    })

    zone.addEventListener('dragenter', () => {
      zone.classList.add('ring-2', 'ring-[#6366F1]/70', 'bg-[#1F2937]/70')
    })

    zone.addEventListener('dragleave', event => {
      if (!zone.contains(event.relatedTarget)) {
        zone.classList.remove('ring-2', 'ring-[#6366F1]/70', 'bg-[#1F2937]/70')
      }
    })

    zone.addEventListener('drop', event => {
      event.preventDefault()
      zone.classList.remove('ring-2', 'ring-[#6366F1]/70', 'bg-[#1F2937]/70')

      const targetStatus = zone.getAttribute('data-status')

      if (!targetStatus || !draggedTaskId) {
        return
      }

      tasks = tasks.map(task =>
        task.id === draggedTaskId ? { ...task, status: targetStatus } : task,
      )

      saveTasks()
      renderTasks()
    })
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
          <div id="todo-list" data-dropzone="true" data-status="todo" class="flex flex-1 flex-col gap-3 rounded-lg transition"></div>
        </section>

        <section class="flex flex-col min-h-90 p-4 rounded-xl border border-[#374151] bg-[#111827]">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-base text-[#F9FAFB] font-bold">Em Andamento</h2>
            <span id="in-progress-count" class="px-2.5 py-1 rounded-full border text-xs text-amber-200 font-semibold bg-amber-500/20 border-amber-400/40">0</span>
          </div>
          <div id="in-progress-list" data-dropzone="true" data-status="in-progress" class="flex flex-1 flex-col gap-3 rounded-lg transition"></div>
        </section>

        <section class="flex flex-col min-h-90 p-4 rounded-xl border border-[#374151] bg-[#111827]">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-base text-[#F9FAFB] font-bold">Concluído</h2>
            <span id="done-count" class="px-2.5 py-1 rounded-full border text-xs text-emerald-200 font-semibold bg-emerald-500/20 border-emerald-400/40">0</span>
          </div>
          <div id="done-list" data-dropzone="true" data-status="done" class="flex flex-1 flex-col gap-3 rounded-lg transition"></div>
        </section>
      </div>

      <div id="task-modal" class="fixed inset-0 z-50 hidden bg-black/60 p-4">
        <div class="w-full max-w-md mx-auto mt-20 p-5 rounded-xl border border-[#374151] bg-[#111827] shadow-2xl">
          <div class="flex justify-between items-center mb-4">
            <h3 id="task-modal-title" class="text-lg text-[#F9FAFB] font-bold">Nova tarefa</h3>
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
                id="task-submit-button"
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
