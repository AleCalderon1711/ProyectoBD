import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import { getAuditoriaById, guardarRespuestas, finalizarAuditoria } from '../../api/auditorias'
import { getControles } from '../../api/controles'
import { getOrganizacionById } from '../../api/organizaciones'
import type { ControlCuestionario } from '../../mock/cuestionario'
import type { Auditoria, RespuestaPregunta, ValorRespuesta } from '../../types/auditoria'
import type { Organizacion } from '../../types/organizacion'

type RespuestasState = Record<string, { respuesta: ValorRespuesta | null; evidencia: string }>

const opcionesRespuesta: { valor: ValorRespuesta; label: string }[] = [
  { valor: 'SI', label: 'Sí' },
  { valor: 'NO', label: 'No' },
  { valor: 'NA', label: 'N/A' },
]

const dominioBadgeClasses: Record<ControlCuestionario['dominio'], string> = {
  Organizacional: 'bg-blue-50 text-blue-700',
  Personas: 'bg-purple-50 text-purple-700',
  Físico: 'bg-amber-50 text-amber-700',
  Tecnológico: 'bg-emerald-50 text-emerald-700',
}

export default function Cuestionario() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [auditoria, setAuditoria] = useState<Auditoria | null>(null)
  const [organizacion, setOrganizacion] = useState<Organizacion | null>(null)
  const [controles, setControles] = useState<ControlCuestionario[]>([])
  const [respuestas, setRespuestas] = useState<RespuestasState>({})
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState<'guardar' | 'finalizar' | null>(null)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    if (!id) return

    Promise.all([getAuditoriaById(id), getControles()]).then(([auditoriaEncontrada, controlesData]) => {
      setControles(controlesData)

      if (auditoriaEncontrada) {
        setAuditoria(auditoriaEncontrada)
        getOrganizacionById(auditoriaEncontrada.organizacionId).then((org) => setOrganizacion(org ?? null))

        const estadoInicial: RespuestasState = {}
        for (const control of controlesData) {
          for (const pregunta of control.preguntas) {
            const existente = auditoriaEncontrada.respuestas.find((r) => r.idPregunta === pregunta.id)
            estadoInicial[pregunta.id] = {
              respuesta: existente?.respuesta ?? null,
              evidencia: existente?.evidencia ?? '',
            }
          }
        }
        setRespuestas(estadoInicial)
      }

      setCargando(false)
    })
  }, [id])

  const totalPreguntas = useMemo(
    () => controles.reduce((total, control) => total + control.preguntas.length, 0),
    [controles],
  )

  const contestadas = useMemo(
    () => Object.values(respuestas).filter((r) => r.respuesta !== null).length,
    [respuestas],
  )

  const handleRespuesta = (preguntaId: string, valor: ValorRespuesta) => {
    setRespuestas((prev) => ({
      ...prev,
      [preguntaId]: { ...prev[preguntaId], respuesta: valor },
    }))
  }

  const handleEvidencia = (preguntaId: string, evidencia: string) => {
    setRespuestas((prev) => ({
      ...prev,
      [preguntaId]: { ...prev[preguntaId], evidencia },
    }))
  }

  const buildRespuestasPayload = (): RespuestaPregunta[] =>
    Object.entries(respuestas)
      .filter(([, valor]) => valor.respuesta !== null)
      .map(([idPregunta, valor]) => ({
        idPregunta,
        respuesta: valor.respuesta as ValorRespuesta,
        evidencia: valor.evidencia,
      }))

  const handleGuardar = async () => {
    if (!id) return
    setGuardando('guardar')
    setMensaje('')
    try {
      await guardarRespuestas(id, buildRespuestasPayload())
      navigate('/auditorias')
    } finally {
      setGuardando(null)
    }
  }

  const handleFinalizar = async () => {
    if (!id) return

    if (contestadas < totalPreguntas) {
      setMensaje(`Faltan ${totalPreguntas - contestadas} preguntas por contestar antes de finalizar.`)
      return
    }

    setGuardando('finalizar')
    setMensaje('')
    try {
      await guardarRespuestas(id, buildRespuestasPayload())
      await finalizarAuditoria(id)
      navigate(`/auditorias/${id}/resultados`)
    } finally {
      setGuardando(null)
    }
  }

  if (cargando) {
    return <p className="text-sm text-gray-500">Cargando cuestionario…</p>
  }

  if (!auditoria) {
    return (
      <div>
        <PageHeader title="Cuestionario" />
        <p className="text-sm text-gray-600">No se encontró la auditoría solicitada.</p>
      </div>
    )
  }

  return (
    <div className="pb-24">
      <PageHeader title="Cuestionario de auditoría" />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded border border-gray-200 bg-white p-4">
        <div>
          <p className="text-sm text-gray-500">
            Organización: <span className="font-medium text-gray-700">{organizacion?.nombre ?? auditoria.organizacionId}</span>
          </p>
          <p className="text-sm text-gray-500">
            Auditor: <span className="font-medium text-gray-700">{auditoria.auditorResponsable}</span>
            {auditoria.dbaResponsable ? (
              <>
                {' · '}DBA: <span className="font-medium text-gray-700">{auditoria.dbaResponsable}</span>
              </>
            ) : null}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-2 w-40 overflow-hidden rounded bg-gray-100">
            <div
              className="h-full bg-gray-700"
              style={{ width: `${totalPreguntas ? (contestadas / totalPreguntas) * 100 : 0}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">
            {contestadas}/{totalPreguntas} contestadas
          </span>
        </div>
      </div>

      {mensaje ? (
        <div className="mb-4 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
          {mensaje}
        </div>
      ) : null}

      <div className="flex flex-col gap-4">
        {controles.map((control) => (
          <section key={control.id} className="rounded border border-gray-200 bg-white p-4">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                {control.codigoIso}
              </span>
              <h2 className="text-sm font-semibold text-gray-800">{control.nombre}</h2>
              <span className={`rounded px-2 py-0.5 text-xs font-medium ${dominioBadgeClasses[control.dominio]}`}>
                {control.dominio}
              </span>
            </div>

            <div className="flex flex-col divide-y divide-gray-100">
              {control.preguntas.map((pregunta) => (
                <div key={pregunta.id} className="py-3">
                  <p className="mb-2 text-sm text-gray-700">{pregunta.texto}</p>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex gap-3">
                      {opcionesRespuesta.map((opcion) => (
                        <label key={opcion.valor} className="flex items-center gap-1 text-sm text-gray-600">
                          <input
                            type="radio"
                            name={pregunta.id}
                            checked={respuestas[pregunta.id]?.respuesta === opcion.valor}
                            onChange={() => handleRespuesta(pregunta.id, opcion.valor)}
                          />
                          {opcion.label}
                        </label>
                      ))}
                    </div>

                    <input
                      type="text"
                      value={respuestas[pregunta.id]?.evidencia ?? ''}
                      onChange={(event) => handleEvidencia(pregunta.id, event.target.value)}
                      placeholder="Evidencia (opcional)"
                      className="min-w-[220px] flex-1 rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-gray-500 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="fixed bottom-0 left-56 right-0 flex items-center justify-end gap-2 border-t border-gray-200 bg-white p-4">
        <button
          type="button"
          onClick={handleGuardar}
          disabled={guardando !== null}
          className="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {guardando === 'guardar' ? 'Guardando…' : 'Guardar y continuar después'}
        </button>
        <button
          type="button"
          onClick={handleFinalizar}
          disabled={guardando !== null}
          className="rounded bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700 disabled:opacity-50"
        >
          {guardando === 'finalizar' ? 'Finalizando…' : 'Finalizar auditoría'}
        </button>
      </div>
    </div>
  )
}
