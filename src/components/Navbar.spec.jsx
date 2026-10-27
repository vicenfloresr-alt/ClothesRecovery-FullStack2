import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { CarritoProvider } from '../context/CarritoContext';
import { SesionProvider } from '../context/SesionContext';

function Ruta() {
  const ubicacion = useLocation();
  return <span data-testid="ruta">{ubicacion.pathname + ubicacion.search}</span>;
}

function montar() {
  render(
    <SesionProvider>
      <CarritoProvider>
        <MemoryRouter initialEntries={['/']}>
          <Navbar />
          <Routes>
            <Route path="*" element={<Ruta />} />
          </Routes>
        </MemoryRouter>
      </CarritoProvider>
    </SesionProvider>
  );
}

describe('Navbar', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it('sin sesión muestra "Iniciar sesión" y "Crear cuenta"', () => {
    montar();
    expect(screen.getAllByText('Iniciar sesión').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Crear cuenta').length).toBeGreaterThan(0);
    expect(screen.queryByText(/Cerrar sesión/)).toBeNull();
  });

  it('con sesión muestra el nombre y "Cerrar sesión", y oculta el login', () => {
    localStorage.setItem('sesion-clothesrecovery', JSON.stringify({ nombre: 'Ana', apellidos: 'P', correo: 'a@a.cl' }));
    montar();
    expect(screen.getByText('Hola, Ana')).toBeTruthy();
    expect(screen.getAllByText(/Cerrar sesión/).length).toBeGreaterThan(0);
    expect(screen.queryByText('Iniciar sesión')).toBeNull();
  });

  it('"Cerrar sesión" termina la sesión y vuelve al inicio', () => {
    localStorage.setItem('sesion-clothesrecovery', JSON.stringify({ nombre: 'Ana', apellidos: 'P', correo: 'a@a.cl' }));
    montar();
    fireEvent.click(screen.getAllByText(/Cerrar sesión/)[0]);
    expect(screen.queryByText('Hola, Ana')).toBeNull();
    expect(screen.getByTestId('ruta').textContent).toBe('/');
  });

  it('el buscador navega a /productos con el texto en la URL', () => {
    montar();
    fireEvent.change(screen.getByLabelText('Buscar'), { target: { value: 'polera negra' } });
    fireEvent.submit(screen.getByLabelText('Buscar').closest('form'));
    expect(screen.getByTestId('ruta').textContent).toBe('/productos?q=polera%20negra');
  });

  it('el buscador con el texto vacío navega a /productos sin filtro', () => {
    montar();
    fireEvent.submit(screen.getByLabelText('Buscar').closest('form'));
    expect(screen.getByTestId('ruta').textContent).toBe('/productos');
  });

  it('el buscador del menú móvil también navega con el texto escrito', () => {
    montar();
    fireEvent.change(screen.getByLabelText('Buscar en el menú'), { target: { value: 'cargo' } });
    fireEvent.submit(screen.getByLabelText('Buscar en el menú').closest('form'));
    expect(screen.getByTestId('ruta').textContent).toBe('/productos?q=cargo');
  });

  it('el contador del carrito parte en 0', () => {
    montar();
    expect(document.querySelector('.cart-count').textContent).toBe('0');
  });

  it('lista las 4 categorías en el menú desplegable', () => {
    montar();
    const items = document.querySelectorAll('.dropdown-menu .dropdown-item');
    expect(items.length).toBe(4);
  });
});
