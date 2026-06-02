export default function FormField({
  label,
  hint,
  required = false,
  children,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-text-primary">
        {label}
        {required && <span className="text-danger-text"> *</span>}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-text-muted">{hint}</p>}
    </div>
  )
}

export const inputClassName =
  'w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-text-primary shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15'

export const selectClassName = inputClassName
