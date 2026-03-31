export default function Card(task) {
  return `
        <article
            draggable="true"
            data-task-id="${task.id}"
            class="rounded-lg border border-[#6366F1]/40 bg-[#1F2937] p-4 shadow-sm transition hover:border-[#6366F1]/80 cursor-grab active:cursor-grabbing"
        >
            <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                    <h3 class="text-sm font-bold text-[#F9FAFB]">${task.title}</h3>
                    <p class="mt-1 text-sm text-[#D1D5DB]">${task.description || 'Sem descrição.'}</p>
                </div>

                <div class="flex flex-col gap-2">
                    <button
                        type="button"
                        data-edit-task="${task.id}"
                        class="rounded-md border border-blue-400/40 px-2 py-1 text-xs font-semibold text-blue-200 transition hover:border-blue-300/70 hover:bg-blue-500/10"
                        aria-label="Editar tarefa"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        data-delete-task="${task.id}"
                        class="rounded-md border border-red-400/40 px-2 py-1 text-xs font-semibold text-red-300 transition hover:border-red-300/70 hover:bg-red-500/10"
                        aria-label="Deletar tarefa"
                    >
                        Deletar
                    </button>
                </div>
            </div>
        </article>
    `
}
