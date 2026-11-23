import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import { SesionProvider } from '../context/SesionContext';

function montar() {
  render(
    <SesionProvider>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<h1>PAGINA-INICIO</h1>} />
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

describe('Login', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it('con credenciales correctas navega al inicio', () => {
    montar();
    iniciarSesion('pixu@clothesrecovery.cl', '12345');
    expect(screen.getByText('PAGINA-INICIO')).toBeTruthy();
  });

  it('con clave incorrecta muestra el mensaje de error y no navega', () => {
    montar();
    iniciarSesion('pixu@clothesrecovery.cl', 'mala');
    expect(screen.getByText('Correo o contraseña incorrectos.')).toBeTruthy();
    expect(screen.queryByText('PAGINA-INICIO')).toBeNull();
  });

  it('no muestra el error antes de enviar el formulario', () => {
    montar();
    expect(screen.queryByText('Correo o contraseña incorrectos.')).toBeNull();
  });

  it('con credenciales correctas guarda la sesión (sin la contraseña)', () => {
    const espia = spyOn(Storage.prototype, 'setItem').and.callThrough();
    montar();
    iniciarSesion('pixu@clothesrecovery.cl', '12345');
    expect(espia).toHaveBeenCalledWith('sesion-clothesrecovery', jasmine.any(String));
    const guardado = JSON.parse(localStorage.getItem('sesion-clothesrecovery'));
    expect(guardado.correo).toBe('pixu@clothesrecovery.cl');
    expect(guardado.password).toBeUndefined();
  });

  it('con clave incorrecta no guarda ninguna sesión', () => {
    montar();
    iniciarSesion('pixu@clothesrecovery.cl', 'mala');
    expect(localStorage.getItem('sesion-clothesrecovery')).toBeNull();
  });
});
