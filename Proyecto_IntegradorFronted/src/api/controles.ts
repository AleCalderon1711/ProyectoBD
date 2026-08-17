import { controlesCuestionarioMock } from '../mock/cuestionario'
import type { ControlCuestionario } from '../mock/cuestionario'

export async function getControles(): Promise<ControlCuestionario[]> {
  return Promise.resolve(controlesCuestionarioMock)
}
