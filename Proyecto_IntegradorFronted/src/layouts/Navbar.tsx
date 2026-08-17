export default function Navbar() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
      <span className="text-sm text-gray-500">Panel de Auditoría</span>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Usuario Demo</span>
        <button type="button" className="text-sm text-gray-400 hover:text-gray-600">
          Salir
        </button>
      </div>
    </header>
  )
}
