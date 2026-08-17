import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Login from '../pages/Login/Login'
import Dashboard from '../pages/Dashboard/Dashboard'
import OrganizacionesList from '../pages/Organizaciones/OrganizacionesList'
import OrganizacionForm from '../pages/Organizaciones/OrganizacionForm'
import AuditoriasList from '../pages/Auditorias/AuditoriasList'
import NuevaAuditoriaForm from '../pages/NuevaAuditoria/NuevaAuditoriaForm'
import Cuestionario from '../pages/Cuestionario/Cuestionario'
import Resultados from '../pages/Resultados/Resultados'
import Historial from '../pages/Historial/Historial'

// Nota: por ahora ninguna ruta está protegida (el Login todavía no tiene
// lógica). Cuando el login quede conectado, envolver las rutas privadas
// con <ProtectedRoute> desde src/components/ProtectedRoute.tsx.
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/organizaciones" element={<OrganizacionesList />} />
        <Route path="/organizaciones/nueva" element={<OrganizacionForm />} />
        <Route path="/organizaciones/:id/editar" element={<OrganizacionForm />} />
        <Route path="/auditorias" element={<AuditoriasList />} />
        <Route path="/auditorias/nueva" element={<NuevaAuditoriaForm />} />
        <Route path="/auditorias/:id/cuestionario" element={<Cuestionario />} />
        <Route path="/auditorias/:id/resultados" element={<Resultados />} />
        <Route path="/historial" element={<Historial />} />
      </Route>
    </Routes>
  )
}
