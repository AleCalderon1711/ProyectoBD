import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import { getOrganizaciones } from '../../api/organizaciones'
import { getUsuariosPorRol } from '../../api/usuarios'
import { createAuditoria } from '../../api/auditorias'
import type { Organizacion } from '../../types/organizacion'
import type { Usuario } from '../../types/auth'

interface NuevaAuditoriaFormData {
  organizacionId: string
  auditorResponsable: string
  dbaResponsable: string
  fechaAuditoria: string
  observacionesGenerales: string
}

const hoyISO = () => new Date().toISOString().slice(0, 10)

const initialFormData: NuevaAuditoriaFormData = {
  organizacionId: '',
  auditorResponsable: '',
  dbaResponsable: '',
  fechaAuditoria: hoyISO(),
  observacionesGenerales: '',
}

export default function NuevaAuditoriaForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [organizaciones, setOrganizaciones] = useState<Organizacion[]>([])
  const [auditores, setAuditores] = useState<Usuario[]>([])
  const [dbas, setDbas] = useState<Usuario[]>([])
  const [formData, setFormData] = useState<NuevaAuditoriaFormData>(initialFormData)
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    getOrganizaciones().then(setOrganizaciones)
    getUsuariosPorRol('AUDITOR').then(setAuditores)
    getUsuariosPorRol('DBA').then(setDbas)
  }, [])

  useEffect(() => {
    const organizacionIdFromQuery = searchParams.get('organizacionId')
    if (!organizacionIdFromQuery) return

    setFormData((prev) => ({ ...prev, organizacionId: organizacionIdFromQuery }))
  }, [searchParams])

  const handleChange = (field: keyof NuevaAuditoriaFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCancelar = () => {
    navigate('/auditorias')
  }

  const handleIniciar = async () => {
    setError('')

    if (!formData.organizacionId || !formData.auditorResponsable || !formData.fechaAuditoria) {
      setError('Organización, auditor responsable y fecha son obligatorios.')
      return
    }

    setEnviando(true)
    try {
      const auditoria = await createAuditoria({
        organizacionId: formData.organizacionId,
        auditorResponsable: formData.auditorResponsable,
        dbaResponsable: formData.dbaResponsable || undefined,
        fechaAuditoria: formData.fechaAuditoria,
        observacionesGenerales: formData.observacionesGenerales,
      })
      navigate(`/auditorias/${auditoria.id}/cuestionario`)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div>
      <PageHeader title="Iniciar auditoría" />

      <div className="rounded border border-gray-200 bg-white p-4">
        {error ? (
          <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mb-4">
          <label htmlFor="organizacion" className="mb-1 block text-sm font-medium text-gray-700">
            Organización *
          </label>
          <select
            id="organizacion"
            value={formData.organizacionId}
            onChange={(event) => handleChange('organizacionId', event.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          >
            <option value="">Seleccione una organización</option>
            {organizaciones.map((organizacion) => (
              <option key={organizacion.id} value={organizacion.id}>
                {organizacion.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="auditor" className="mb-1 block text-sm font-medium text-gray-700">
            Usuario auditor *
          </label>
          <select
            id="auditor"
            value={formData.auditorResponsable}
            onChange={(event) => handleChange('auditorResponsable', event.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          >
            <option value="">Seleccione un auditor</option>
            {auditores.map((auditor) => (
              <option key={auditor.id} value={auditor.nombre}>
                {auditor.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="dba" className="mb-1 block text-sm font-medium text-gray-700">
            Usuario DBA (opcional)
          </label>
          <select
            id="dba"
            value={formData.dbaResponsable}
            onChange={(event) => handleChange('dbaResponsable', event.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          >
            <option value="">Ninguno</option>
            {dbas.map((dba) => (
              <option key={dba.id} value={dba.nombre}>
                {dba.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="fecha" className="mb-1 block text-sm font-medium text-gray-700">
            Fecha de auditoría *
          </label>
          <input
            id="fecha"
            type="date"
            value={formData.fechaAuditoria}
            onChange={(event) => handleChange('fechaAuditoria', event.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="observaciones" className="mb-1 block text-sm font-medium text-gray-700">
            Observaciones generales
          </label>
          <textarea
            id="observaciones"
            value={formData.observacionesGenerales}
            onChange={(event) => handleChange('observacionesGenerales', event.target.value)}
            rows={3}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleIniciar}
            disabled={enviando}
            className="rounded bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {enviando ? 'Iniciando…' : 'Iniciar auditoría'}
          </button>
          <button
            type="button"
            onClick={handleCancelar}
            className="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
