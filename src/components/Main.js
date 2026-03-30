export default function Main() {
  return `
        <main class="flex flex-1 flex-col justify-center items-center w-full gap-6 p-8 bg-[#111827]">
          <h1 class="text-xl font-bold text-[#F9FAFB]">Conteúdo Principal</h1>

          <div class="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="rounded-lg p-6 bg-[#111827] border border-[#1F2937] text-[#F9FAFB]">
              Fundo Escuro
            </div>
            <div class="rounded-lg p-6 bg-[#1F2937] text-[#F9FAFB]">
              Bloco Secundário
            </div>
            <div class="rounded-lg p-6 bg-[#F9FAFB] text-[#111827]">
              Bloco Claro
            </div>
            <div class="rounded-lg p-6 bg-[#6366F1] text-[#F9FAFB]">
              Destaque
            </div>
          </div>
        </main>
    `
}
