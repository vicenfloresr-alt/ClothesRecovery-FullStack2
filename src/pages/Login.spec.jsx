import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import { SesionProvider } from '../context/SesionContext';
import { simularApi, cuerpoEnviado } from '../test-utils/simularApi';

const respuestaCliente = {
  id: 3,
  nombre: 'Pixu',
  username: 'pixu@clothesrecovery.cl',
  rol: 'CLIENTE',
  clienteId: 2,
  token: 'token-cliente',
};

function montar() {
  render(
    <SesionProvider>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<h1>PAGINA-INICIO</h1>} />
          <Route path="/admin" element={<h1>PAGINA-ADMIN</h1>} />
        </Routes>
      </MemoryRouter>
    </SesionProvider>
  );
}

function iniciarSesion(correo, clave) {
  fireEvent.change(screen.getByLabelText('Correo'), { target: { value: correo } });
  fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: clave } });
  fireEvent.submit(screen.getByLabelText('Correo').closest('form'));
}

describe('Login (contra el backend)', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it('envía correo y contraseña a /auth/login', async () => {
    const espia = simularApi([{ ruta: '/auth/login', metodo: 'POST', datos: respuestaCliente }]);
    montar();
    iniciarSesion('pixu@clothesrecovery.cl', '12345');
    await screen.findByText('PAGINA-INICIO');
    expect(cuerpoEnviado(espia, 0)).toEqual({ username: 'pixu@clothesrecovery.cl', password: '12345' });
  });

  it('un CLIENTE con credenciales correctas navega al inicio', async () => {
    simularApi([{ ruta: '/auth/login', metodo: 'POST', datos: respuestaCliente }]);
    montar();
    iniciarSesion('pixu@clothesrecovery.cl', '12345');
    expect(await screen.findByText('PAGINA-INICIO')).toBeTruthy();
  });

  it('un ADMIN navega al panel de administración', async () => {
    simularApi([{ ruta: '/auth/login', metodo: 'POST', datos: { ...respuestaCliente, rol: 'ADMIN', clienteId: null } }]);
    montar();
    iniciarSesion('admin@clothesrecovery.cl', 'admin123');
    expect(await screen.findByText('PAGINA-ADMIN')).toBeTruthy();
  });

  it('un VENDEDOR también navega al panel', async () => {
    simularApi([{ ruta: '/auth/login', metodo: 'POST', datos: { ...respuestaCliente, rol: 'VENDEDOR', clienteId: null } }]);
    montar();
    iniciarSesion('vendedor@clothesrecovery.cl', 'vendedor123');
    expect(await screen.findByText('PAGINA-ADMIN')).toBeTruthy();
  });

  it('con clave incorrecta (401) muestra el mensaje de error y no navega', async () => {
    simularApi([{ ruta: '/auth/login', metodo: 'POST', status: 401, datos: { error: 'Usuario o contraseña incorrectos' } }]);
    montar();
    iniciarSesion('pixu@clothesrecovery.cl', 'mala');
    expect(await screen.findByText('Correo o contraseña incorrectos.')).toBeTruthy();
    expect(screen.queryByText('PAGINA-INICIO')).toBeNull();
  });

  it('si el backend está apagado avisa que no hay conexión', async () => {
    simularApi([{ ruta: '/auth/login', metodo: 'POST', falla: true }]);
    montar();
    iniciarSesion('pixu@clothesrecovery.cl', '12345');
    expect(await screen.findByText(/No se pudo conectar con el servidor/)).toBeTruthy();
  });

  it('no muestra el error antes de enviar el formulario', () => {
    montar();
    expect(screen.queryByText('Correo o contraseña incorrectos.')).toBeNull();
  });

  it('con credenciales correctas guarda la sesión con el token (sin la contraseña)', async () => {
    simularApi([{ ruta: '/auth/login', metodo: 'POST', datos: respuestaCliente }]);
    montar();
    iniciarSesion('pixu@clothesrecovery.cl', '12345');
    await screen.findByText('PAGINA-INICIO');
    await waitFor(() => {
      if (localStorage.getItem('sesion-clothesrecovery') === null) {
        throw new Error('la sesión aún no se guarda');
      }
    });
    const guardado = JSON.parse(localStorage.getItem('sesion-clothesrecovery'));
    expect(guardado.correo).toBe('pixu@clothesrecovery.cl');
    expect(guardado.token).toBe('token-cliente');
    expect(guardado.rol).toBe('CLIENTE');
    expect(guardado.password).toBeUndefined();
  });

  it('con clave incorrecta no guarda ninguna sesión', async () => {
    simularApi([{ ruta: '/auth/login', metodo: 'POST', status: 401, datos: { error: 'x' } }]);
    montar();
    iniciarSesion('pixu@clothesrecovery.cl', 'mala');
    await screen.findByText('Correo o contraseña incorrectos.');
    expect(localStorage.getItem('sesion-clothesrecovery')).toBeNull();
  });
});
