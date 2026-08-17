interface SearchInputProps {
  value: string
  placeholder?: string
  onChange: (value: string) => void
}

export default function SearchInput({ value, placeholder, onChange }: SearchInputProps) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className="mb-4 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
    />
  )
}
