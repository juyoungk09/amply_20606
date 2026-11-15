import type { InputHTMLAttributes } from 'react'

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  /** 입력값 아래에 보여 줄 오류 문구 */
  error?: string
}

export default function TextField({ label, error, id, name, ...props }: TextFieldProps) {
  const inputId = id ?? name

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-sm font-semibold text-dim">
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        className={`rounded-2xl border-2 bg-stage px-4 py-3 md:px-5 md:py-3.5 md:text-lg text-ink outline-none placeholder:text-dim/50 focus:border-neon-pink ${
          error ? 'border-neon-red' : 'border-line'
        }`}
        {...props}
      />
      {error && <p className="text-sm font-semibold text-neon-red">{error}</p>}
    </div>
  )
}
