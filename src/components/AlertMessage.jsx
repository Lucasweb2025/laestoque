const estilos = {
  sucesso: 'border-success-border bg-success-bg text-success-text',
  erro: 'border-danger-border bg-danger-bg text-danger-text',
  info: 'border-blue-200 bg-primary-muted text-primary',
}

const icones = {
  sucesso: '✓',
  erro: '!',
  info: 'i',
}

export default function AlertMessage({ tipo = 'info', mensagem }) {
  if (!mensagem) return null

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-lg border px-4 py-3.5 text-sm font-medium ${estilos[tipo]}`}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/60 text-xs font-bold">
        {icones[tipo]}
      </span>
      <p className="leading-snug">{mensagem}</p>
    </div>
  )
}
