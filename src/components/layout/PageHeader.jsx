export default function PageHeader({ title, subtitle, actions, meta }) {
  return (
    <header className="mb-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-[1.625rem] font-bold leading-tight tracking-tight text-title">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-text-muted">
              {subtitle}
            </p>
          )}
          {meta && (
            <p className="mt-3 text-xs font-medium text-text-muted">{meta}</p>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
        )}
      </div>
    </header>
  )
}
