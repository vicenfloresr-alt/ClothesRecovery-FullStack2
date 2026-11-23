import { pedirApi } from './api';

export async function listarClientesApi() {
  return pedirApi('/clientes');
}
