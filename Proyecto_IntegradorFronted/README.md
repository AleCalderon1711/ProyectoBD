# db-risk-frontend

Frontend del proyecto de Evaluación de Riesgo en Administración de Bases de Datos
(ISO/IEC 27002) — EIF402, Universidad Nacional.

## Cómo correrlo

```bash
npm install
npm run dev
```

## Estado actual (Etapa 1)

Incluido en esta etapa:
- Estructura de carpetas completa (`api`, `components`, `context`, `layouts`,
  `pages`, `routes`, `types`, `mock`, `hooks`, `utils`).
- Rutas base con React Router (`/login`, `/dashboard`).
- Layout principal (`Sidebar` + `Navbar` + área de contenido).
- Pantalla de **Login** (solo visual, sin lógica de autenticación todavía).
- Pantalla de **Dashboard** vacía con tarjetas placeholder.
- `AuthContext` + `useAuth` creados pero no conectados al Login todavía.
- `ProtectedRoute` creado pero no aplicado a ninguna ruta todavía (se activará
  cuando el Login tenga lógica real).
- `axiosClient` con interceptor de token, listo para cuando exista backend.
- `api/auth.ts` como ejemplo de servicio que hoy devuelve un mock.

Pendiente para próximas etapas (no incluido a propósito):
- Lista y formulario de organizaciones.
- Nueva auditoría.
- Cuestionario (controles + preguntas + respuestas).
- Resultados, historial y exportación de reportes.
- Archivos mock de controles/preguntas/auditorías.

## Notas

- No hay backend real: todo lo que se agregue en `src/api` debe devolver datos
  desde `src/mock` hasta que el backend esté listo.
- Diseño intencionalmente simple (solo Tailwind básico), sin animaciones ni
  estilos elaborados.
