import './style.css'

const STORAGE_KEY = 'toodo_tasks'

const loadTasks = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const parsed = stored ? JSON.parse(stored) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const saveTasks = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

const tasks = loadTasks()

const escapeHtml = value =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const renderTask = (task, index) => `
  <article
    data-task-index="${index}"
    class="rounded-2xl border border-slate-700 bg-slate-900/90 p-4 shadow-lg shadow-black/10 transition hover:border-indigo-400/60"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0 flex-1">
        <h3 class="text-base font-semibold text-slate-50 ${task.completed ? 'line-through text-emerald-300' : ''}">
          ${escapeHtml(task.text)}
        </h3>

        <button
          type="button"
          data-action="toggle-description"
          class="mt-2 inline-flex items-center text-slate-500 transition hover:text-indigo-200"
          aria-expanded="false"
          aria-label="Abrir descrição"
        >
          <svg
            data-role="chevron"
            aria-hidden="true"
            viewBox="0 0 20 20"
            class="h-4 w-4 transition-transform"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path d="M5.5 7.5L10 12l4.5-4.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <div data-role="description-panel" class="mt-3 hidden rounded-xl border border-slate-700 bg-slate-950/70 p-3">
          <p class="text-sm leading-6 text-slate-300 ${task.completed ? 'opacity-80' : ''}">
            ${escapeHtml(task.description)}
          </p>
        </div>
      </div>

      <div class="flex shrink-0 flex-wrap justify-end gap-2">
        <button
          type="button"
          data-action="edit-task"
          ${task.completed ? 'disabled' : ''}
          class="rounded-lg border border-sky-400/40 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-200 transition ${task.completed ? 'cursor-not-allowed opacity-40' : 'hover:border-sky-300/70 hover:bg-sky-500/20'}"
        >
          Editar
        </button>

        <button
          type="button"
          data-action="toggle-complete"
          class="rounded-lg border ${task.completed ? 'border-emerald-400/50 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20' : 'border-slate-600 bg-slate-800 text-slate-200 hover:border-emerald-400/50 hover:bg-emerald-500/10 hover:text-emerald-200'} px-3 py-1.5 text-xs font-semibold transition"
        >
          ${task.completed ? 'Concluída' : 'Concluir'}
        </button>

        <button
          type="button"
          data-action="remove-task"
          class="rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-200 transition hover:border-rose-300/70 hover:bg-rose-500/20"
        >
          Remover
        </button>
      </div>
    </div>

  </article>
`

function renderTasks() {
  const $list = $('#task-list')

  if (!$list.length) {
    return
  }

  if (!tasks.length) {
    $list.html(`
      <div class="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 px-4 py-10 text-center text-sm text-slate-400">
        Nenhuma tarefa cadastrada ainda.
      </div>
    `)
    return
  }

  $list.html(tasks.map(renderTask).join(''))
}

function addTask(text, description) {
  tasks.push({
    text,
    description,
    completed: false,
  })
  saveTasks()
  renderTasks()
}

function updateTask(index, changes) {
  tasks[index] = {
    ...tasks[index],
    ...changes,
  }
  saveTasks()
  renderTasks()
}

function removeTask(index) {
  tasks.splice(index, 1)
  saveTasks()
  renderTasks()
}

function toggleTaskCompletion(index) {
  updateTask(index, { completed: !tasks[index].completed })
}

function getTaskCard(element) {
  return $(element).closest('[data-task-index]')
}

$(function () {
  const $app = $('#app')
  let editingTaskIndex = null

  $app.addClass('min-h-screen bg-slate-950 text-slate-100')
  $app.html(`
    <div class="flex min-h-screen flex-col">
      <header class="border-b border-slate-800 bg-slate-900/80 px-6 py-4 backdrop-blur">
        <div class="mx-auto flex w-full max-w-5xl items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-extrabold tracking-tight text-white">TooDo</h1>
            <p class="mt-1 text-sm text-slate-400">Lista de tarefas com jQuery, array e edição inline.</p>
          </div>
        </div>
      </header>

      <main class="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div class="mx-auto flex w-full max-w-5xl flex-col gap-6">
          <section class="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-black/10">
            <div class="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 id="task-form-title" class="text-lg font-bold text-white">Nova tarefa</h2>
                <p id="task-form-subtitle" class="text-sm text-slate-400">Adicione uma tarefa com título e descrição.</p>
              </div>

              <button
                id="cancel-edit-button"
                type="button"
                class="hidden rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
              >
                Cancelar edição
              </button>
            </div>

            <form id="task-form" class="space-y-3">
              <input
                id="task-input"
                type="text"
                class="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-50 outline-none transition placeholder:text-slate-500 focus:border-indigo-400"
                placeholder="Digite uma nova tarefa"
                autocomplete="off"
              />

              <textarea
                id="task-description-input"
                rows="3"
                class="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-50 outline-none transition placeholder:text-slate-500 focus:border-indigo-400"
                placeholder="Digite a descrição da tarefa"
              ></textarea>

              <div class="flex justify-end">
                <button
                  type="submit"
                  id="task-submit-button"
                  class="rounded-xl border border-indigo-400/60 bg-indigo-500/20 px-5 py-3 text-sm font-semibold text-indigo-100 transition hover:bg-indigo-500/30"
                >
                  Adicionar tarefa
                </button>
              </div>
            </form>
          </section>

          <section class="rounded-3xl border border-slate-800 bg-slate-900/50 p-5">
            <div class="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 class="text-lg font-bold text-white">Tarefas</h2>
                <p class="text-sm text-slate-400">Clique no título para abrir ou fechar a descrição.</p>
              </div>
              <span id="task-count" class="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-semibold text-slate-300">0 tarefas</span>
            </div>

            <div id="task-list" class="space-y-3"></div>
          </section>
        </div>
      </main>
    </div>
  `)

  const $taskInput = $('#task-input')
  const $taskDescriptionInput = $('#task-description-input')
  const $taskList = $('#task-list')
  const $taskCount = $('#task-count')
  const $taskFormTitle = $('#task-form-title')
  const $taskFormSubtitle = $('#task-form-subtitle')
  const $taskSubmitButton = $('#task-submit-button')
  const $cancelEditButton = $('#cancel-edit-button')

  const setCreateMode = () => {
    editingTaskIndex = null
    $taskFormTitle.text('Nova tarefa')
    $taskFormSubtitle.text('Adicione uma tarefa com título e descrição.')
    $taskSubmitButton.text('Adicionar tarefa')
    $cancelEditButton.addClass('hidden')
    $('#task-form')[0].reset()
  }

  const setEditMode = index => {
    const task = tasks[index]

    if (!task) {
      return
    }

    editingTaskIndex = index
    $taskFormTitle.text('Editar tarefa')
    $taskFormSubtitle.text('Faça as alterações e salve para atualizar o item.')
    $taskSubmitButton.text('Salvar alterações')
    $cancelEditButton.removeClass('hidden')
    $taskInput.val(task.text)
    $taskDescriptionInput.val(task.description)
    $taskInput.trigger('focus')
  }

  const refreshTaskCount = () => {
    const total = tasks.length
    $taskCount.text(`${total} ${total === 1 ? 'tarefa' : 'tarefas'}`)
  }

  const canEditTask = index => Boolean(tasks[index] && !tasks[index].completed)

  $('#task-form').on('submit', event => {
    event.preventDefault()

    const value = $taskInput.val().trim()
    const description = $taskDescriptionInput.val().trim()

    if (!value || !description) {
      return
    }

    if (editingTaskIndex === null) {
      addTask(value, description)
    } else {
      updateTask(editingTaskIndex, { text: value, description })
      setCreateMode()
    }

    $taskInput.val('').trigger('focus')
    $taskDescriptionInput.val('')
    refreshTaskCount()
  })

  $taskList.on('click', '[data-action="edit-task"]', function () {
    const index = Number(getTaskCard(this).attr('data-task-index'))
    if (!canEditTask(index)) {
      return
    }

    setEditMode(index)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })

  $taskList.on('click', '[data-action="toggle-description"]', function () {
    const $card = getTaskCard(this)
    const $panel = $card.find('[data-role="description-panel"]')
    const isHidden = $panel.hasClass('hidden')
    const $chevron = $(this).find('[data-role="chevron"]')

    $panel.toggleClass('hidden')
    $(this).attr('aria-expanded', String(isHidden))
    $(this).attr(
      'aria-label',
      isHidden ? 'Fechar descrição' : 'Abrir descrição',
    )
    $chevron.toggleClass('rotate-180', isHidden)
  })

  $taskList.on('click', '[data-action="toggle-complete"]', function () {
    const index = Number(getTaskCard(this).attr('data-task-index'))
    toggleTaskCompletion(index)
    refreshTaskCount()
  })

  $taskList.on('click', '[data-action="remove-task"]', function () {
    const index = Number(getTaskCard(this).attr('data-task-index'))
    removeTask(index)
    if (editingTaskIndex === index) {
      setCreateMode()
    }
    refreshTaskCount()
  })

  $cancelEditButton.on('click', () => {
    setCreateMode()
  })

  setCreateMode()
  renderTasks()
  refreshTaskCount()
})
