import { pedirApi, leerToken, API_URL, CLAVE_SESION } from './api';
import { simularApi, respuestaJson } from '../test-utils/simularApi';

describe('api.js (conexión con el backend)', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('la URL base apunta al API Gateway con versión v1', () => {
    expect(API_URL).toBe('http://localhost:9090/api/v1');
  });

  it('pedirApi hace GET a la URL completa y devuelve el JSON', async () => {
    const espia = simularApi([{ ruta: '/productos', datos: [{ id: 1 }] }]);
    const datos = await pedirApi('/productos');
    expect(datos).toEqual([{ id: 1 }]);
    expect(espia.calls.argsFor(0)[0]).toBe('http://localhost:9090/api/v1/productos');
    expect(espia.calls.argsFor(0)[1].method).toBe('GET');
  });

  it('sin sesión no envía el encabezado Authorization', async () => {
    const espia = simularApi([{ ruta: '/productos', datos: [] }]);
    await pedirApi('/productos');
    expect(espia.calls.argsFor(0)[1].headers.Authorization).toBeUndefined();
  });

  it('con sesión envía el token como Bearer', async () => {
    localStorage.setItem(CLAVE_SESION, JSON.stringify({ nombre: 'Ana', token: 'abc123' }));
    const espia = simularApi([{ ruta: '/pedidos', datos: [] }]);
    await pedirApi('/pedidos');
    expect(espia.calls.argsFor(0)[1].headers.Authorization).toBe('Bearer abc123');
  });

  it('envía el cuerpo como JSON con el método indicado', async () => {
    const espia = simularApi([{ ruta: '/pedidos', metodo: 'POST', datos: { id: 9 } }]);
    const datos = await pedirApi('/pedidos', { method: 'POST', body: { cantidad: 2 } });
    expect(datos.id).toBe(9);
    expect(espia.calls.argsFor(0)[1].body).toBe('{"cantidad":2}');
  });

  it('si el backend responde un error, lanza una excepción con su mensaje y el status', async () => {
    simularApi([{ ruta: '/auth/login', metodo: 'POST', status: 401, datos: { error: 'Usuario o contraseña incorrectos' } }]);
    try {
      await pedirApi('/auth/login', { method: 'POST', body: {} });
      fail('debía lanzar un error');
    } catch (error) {
      expect(error.message).toBe('Usuario o contraseña incorrectos');
      expect(error.status).toBe(401);
    }
  });

  it('si el error no trae mensaje, usa uno genérico con el código', async () => {
    simularApi([{ ruta: '/clientes', status: 500, datos: 'texto plano' }]);
    try {
      await pedirApi('/clientes');
      fail('debía lanzar un error');
    } catch (error) {
      expect(error.message).toContain('500');
    }
  });

  it('una respuesta sin cuerpo (204) devuelve null', async () => {
    spyOn(window, 'fetch').and.returnValue(respuestaJson(null, 204));
    const datos = await pedirApi('/productos/1', { method: 'DELETE' });
    expect(datos).toBeNull();
  });

  it('una respuesta que no es JSON se devuelve como texto', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.resolve(new Response('hola', { status: 200 })));
    const datos = await pedirApi('/algo');
    expect(datos).toBe('hola');
  });

  it('leerToken devuelve null si no hay sesión o si está dañada', () => {
    expect(leerToken()).toBeNull();
    localStorage.setItem(CLAVE_SESION, '{dañado');
    expect(leerToken()).toBeNull();
    localStorage.setItem(CLAVE_SESION, JSON.stringify({ nombre: 'Sin token' }));
    expect(leerToken()).toBeNull();
  });
});
