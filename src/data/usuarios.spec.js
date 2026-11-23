import { iniciarSesionApi, registrarUsuarioApi } from './usuarios';
import { simularApi, cuerpoEnviado } from '../test-utils/simularApi';

describe('usuarios.js (autenticación con el backend)', () => {
  beforeEach(() => localStorage.clear());

  it('iniciarSesionApi envía el correo como username y devuelve token y rol', async () => {
    const espia = simularApi([
      { ruta: '/auth/login', metodo: 'POST', datos: { nombre: 'Ana', username: 'ana@correo.cl', rol: 'CLIENTE', clienteId: 3, token: 'abc' } },
    ]);
    const usuario = await iniciarSesionApi('ana@correo.cl', 'clave');
    expect(cuerpoEnviado(espia, 0)).toEqual({ username: 'ana@correo.cl', password: 'clave' });
    expect(usuario.token).toBe('abc');
    expect(usuario.rol).toBe('CLIENTE');
  });

  it('iniciarSesionApi con clave incorrecta lanza error 401', async () => {
    simularApi([{ ruta: '/auth/login', metodo: 'POST', status: 401, datos: { error: 'Usuario o contraseña incorrectos' } }]);
    try {
      await iniciarSesionApi('ana@correo.cl', 'mala');
      fail('debía lanzar un error');
    } catch (error) {
      expect(error.status).toBe(401);
    }
  });

  it('registrarUsuarioApi envía nombre, correo como username, clave y teléfono', async () => {
    const espia = simularApi([{ ruta: '/auth/registro', metodo: 'POST', status: 201, datos: { id: 5, rol: 'CLIENTE' } }]);
    const respuesta = await registrarUsuarioApi({ nombre: 'Ana Pérez', correo: 'ana@correo.cl', password: 'clave', telefono: '912345678' });
    expect(respuesta.rol).toBe('CLIENTE');
    expect(cuerpoEnviado(espia, 0)).toEqual({
      nombre: 'Ana Pérez',
      username: 'ana@correo.cl',
      password: 'clave',
      telefono: '912345678',
    });
  });

  it('registrarUsuarioApi sin teléfono envía un texto vacío', async () => {
    const espia = simularApi([{ ruta: '/auth/registro', metodo: 'POST', status: 201, datos: { id: 5 } }]);
    await registrarUsuarioApi({ nombre: 'Ana', correo: 'ana@correo.cl', password: 'clave' });
    expect(cuerpoEnviado(espia, 0).telefono).toBe('');
  });

  it('registrarUsuarioApi con correo repetido propaga el mensaje del backend', async () => {
    simularApi([{ ruta: '/auth/registro', metodo: 'POST', status: 400, datos: { error: 'Ya existe un usuario registrado con ana@correo.cl' } }]);
    await expectAsync(registrarUsuarioApi({ nombre: 'Ana', correo: 'ana@correo.cl', password: 'x' }))
      .toBeRejectedWithError('Ya existe un usuario registrado con ana@correo.cl');
  });
});
