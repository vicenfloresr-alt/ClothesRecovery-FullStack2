import { listarClientesApi } from './clientes';
import { simularApi } from '../test-utils/simularApi';

describe('clientes.js', () => {
  it('listarClientesApi hace GET /clientes', async () => {
    simularApi([{ ruta: '/clientes', datos: [{ id: 1, nombreCompleto: 'Ana Pérez' }] }]);
    const clientes = await listarClientesApi();
    expect(clientes.length).toBe(1);
    expect(clientes[0].nombreCompleto).toBe('Ana Pérez');
  });
});
