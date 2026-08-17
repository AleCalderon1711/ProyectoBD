import type { NivelRiesgo } from '../../types/auditoria'

const estilosPorNivel: Record<NivelRiesgo, string> = {
  Bajo: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Medio: 'bg-amber-100 text-amber-700 border-amber-200',
  Alto: 'bg-orange-100 text-orange-700 border-orange-200',
  Crítico: 'bg-red-100 text-red-700 border-red-200',
}

interface SemaforoProps {
  nivel: NivelRiesgo
  className?: string
}

// Insignia de semáforo de riesgo (Bajo/Medio/Alto/Crítico) reutilizada en
// el Panel de resultados y en cualquier listado que quiera mostrar el
// nivel de riesgo de una auditoría de un vistazo.
export default function Semaforo({ nivel, className = '' }: SemaforoProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${estilosPorNivel[nivel]} ${className}`}
    >
      {nivel}
    </span>
  )
}
