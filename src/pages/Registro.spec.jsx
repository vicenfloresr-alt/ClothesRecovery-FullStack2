import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Registro from './Registro';
import { simularApi, cuerpoEnviado } from '../test-utils/simularApi';

function montar() {
  render(
    <MemoryRouter initialEntries={['/registro']}>
      <Routes>
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<h1>PAGINA-LOGIN</h1>} />
      </Routes>
    </MemoryRouter>
  );
}

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
}

function completarObligatorios() {
  escribir(/RUN/, '11111111-1');
  escribir(/Fecha de nacimiento/, '2000-01-01');
  escribir(/^Nombre/, 'Ana');
  escribir(/Apellidos/, 'Pérez');
  escribir(/Correo/, 'ana@correo.cl');
  escribir(/Contraseña/, 'clave123');
}

function enviar() {
  fireEvent.submit(screen.getByText('Guardar').closest('form'));
}

describe('Registro (contra el backend)', () => {
  afterEach(cleanup);

  it('si faltan campos obligatorios avisa y no llama al backend', () => {
    const espia = spyOn(window, 'fetch');
    montar();
    enviar();
    expect(screen.getByText('Completa todos los campos obligatorios.')).toBeTruthy();
    expect(espia).not.toHaveBeenCalled();
  });

  it('envía nombre completo, correo, clave y teléfono a /auth/registro y confirma la cuenta', async () => {
    const espia = simularApi([{ ruta: '/auth/registro', metodo: 'POST', status: 201, datos: { id: 4, rol: 'CLIENTE' } }]);
    montar();
    completarObligatorios();
    escribir(/Teléfono/, '912345678');
    enviar();
    expect(await screen.findByText(/Cuenta creada/)).toBeTruthy();
    expect(cuerpoEnviado(espia, 0)).toEqual({
      nombre: 'Ana Pérez',
      username: 'ana@correo.cl',
      password: 'clave123',
      telefono: '912345678',
    });
  });

  it('si el correo ya existe muestra el mensaje del backend', async () => {
    simularApi([{ ruta: '/auth/registro', metodo: 'POST', status: 400, datos: { error: 'Ya existe un usuario registrado con ana@correo.cl' } }]);
    montar();
    completarObligatorios();
    enviar();
    expect(await screen.findByText('Ya existe un usuario registrado con ana@correo.cl')).toBeTruthy();
    expect(screen.queryByText(/Cuenta creada/)).toBeNull();
  });
});
