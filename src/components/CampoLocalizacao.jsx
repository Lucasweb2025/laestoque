import FormField, { inputClassName } from './FormField'
import { localizacoesSugeridas } from '../data/localizacoesSugeridas'

const LIST_ID = 'localizacoes-estoque-central'

export default function CampoLocalizacao({ value, onChange, required = false }) {
  return (
    <FormField
      label="Onde está no estoque central"
      required={required}
      hint="Corredor e posição física (ex.: A2 — Corredor películas). Facilita achar o material na separação."
    >
      <input
        className={inputClassName}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ex.: B2 — Prateleira químicos"
        list={LIST_ID}
        autoComplete="off"
      />
      <datalist id={LIST_ID}>
        {localizacoesSugeridas.map((item) => (
          <option key={item} value={item} />
        ))}
      </datalist>
    </FormField>
  )
}
