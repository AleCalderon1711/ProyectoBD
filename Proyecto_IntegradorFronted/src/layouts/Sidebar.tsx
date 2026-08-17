import { Link } from 'react-router-dom'

const links = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Organizaciones', href: '/organizaciones' },
  { label: 'Auditorías', href: '/auditorias' },
  { label: 'Historial', href: '/historial' },
]

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 border-r border-gray-200 bg-white p-4">
      <div className="mb-6 px-2 text-sm font-semibold text-gray-700">
        Auditoría ISO 27002
      </div>

      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className="rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
