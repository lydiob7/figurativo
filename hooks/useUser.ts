import { mockUser } from '@/utils/mockUser'

export function useUser() {
  // tiene que recibir cookies por parametros y buscar en la db el usuario autenticado
  return mockUser
}
