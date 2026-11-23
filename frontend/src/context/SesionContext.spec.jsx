import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { SesionProvider, useSesion } from './SesionContext';

const usuarioDePrueba = {
  nombre: 'Ana',
  apellidos: 'Pérez',
  correo: 'ana@correo.cl',
  password: 'secreta',
  direccion: { calle: 'Calle 1' },
};

function Panel() {
  const { usuario, iniciarSesion, cerrarSesion } = useSesion();
  return (
    <div>
      <span data-testid="estado">{usuario === null ? 'sin sesion' : usuario.nombre}</span>
      <button onClick={() => iniciarSesion(usuarioDePrueba)}>entrar</button>
      <button onClick={() => cerrarSesion()}>salir</button>
    </div>
  );
}

function montar() {
  return render(
    <SesionProvider>
      <Panel />
    </SesionProvider>
  );
}

describe('SesionContext', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it('parte sin sesión iniciada', () => {
    montar();
    expect(screen.getByTestId('estado').textContent).toBe('sin sesion');
  });

  it('iniciarSesion deja al usuario conectado', () => {
    montar();
    fireEvent.click(screen.getByText('entrar'));
    expect(screen.getByTestId('estado').textContent).toBe('Ana');
  });

  it('no guarda la contraseña en localStorage', () => {
    montar();
    fireEvent.click(screen.getByText('entrar'));
    const guardado = JSON.parse(localStorage.getItem('sesion-clothesrecovery'));
    expect(guardado.nombre).toBe('Ana');
    expect(guardado.password).toBeUndefined();
  });

  it('cerrarSesion quita al usuario y borra lo guardado', () => {
    montar();
    fireEvent.click(screen.getByText('entrar'));
    fireEvent.click(screen.getByText('salir'));
    expect(screen.getByTestId('estado').textContent).toBe('sin sesion');
    expect(localStorage.getItem('sesion-clothesrecovery')).toBeNull();
  });

  it('recupera la sesión guardada al volver a montar (simula recargar)', () => {
    montar();
    fireEvent.click(screen.getByText('entrar'));
    cleanup();
    montar();
    expect(screen.getByTestId('estado').textContent).toBe('Ana');
  });

  it('si localStorage tiene datos dañados, parte sin sesión', () => {
    localStorage.setItem('sesion-clothesrecovery', '{esto no es json');
    montar();
    expect(screen.getByTestId('estado').textContent).toBe('sin sesion');
  });
});
