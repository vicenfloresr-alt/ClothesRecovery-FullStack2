import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';

function montar() {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<h1>PAGINA-INICIO</h1>} />
      </Routes>
    </MemoryRouter>
  );
}

function iniciarSesion(correo, clave) {
  fireEvent.change(screen.getByLabelText('Correo'), { target: { value: correo } });
  fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: clave } });
  fireEvent.submit(screen.getByLabelText('Correo').closest('form'));
}

describe('Login', () => {
  afterEach(cleanup);

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
});
