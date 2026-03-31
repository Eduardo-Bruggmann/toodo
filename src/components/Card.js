export default function Card(task) {
  return `
        <article class="rounded-lg border border-[#6366F1]/40 bg-[#1F2937] p-4 shadow-sm transition hover:border-[#6366F1]/80">
            <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                    <h3 class="text-sm font-bold text-[#F9FAFB]">${task.title}</h3>
                    <p class="mt-1 text-sm text-[#D1D5DB]">${task.description || 'Sem descrição.'}</p>
                </div>

                <button
                    type="button"
                    data-delete-task="${task.id}"
                    class="rounded-md border border-red-400/40 px-2 py-1 text-xs font-semibold text-red-300 transition hover:border-red-300/70 hover:bg-red-500/10"
                    aria-label="Deletar tarefa"
                >
                    Deletar
                </button>
            </div>
        </article>
    `
}
