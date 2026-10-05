import { mockUser } from './mockUser'

export function getUser() {
  // tiene que recibir cookies por parametros y buscar en la db el usuario autenticado
  return Promise.resolve(mockUser)
}
