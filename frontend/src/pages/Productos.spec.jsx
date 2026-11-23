import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Productos from './Productos';
import Ofertas from './Ofertas';
import { CarritoProvider } from '../context/CarritoContext';
import { obtenerProductos } from '../data/productos';

function montar(vista, ruta) {
  render(
    <CarritoProvider>
      <MemoryRouter initialEntries={[ruta]}>{vista}</MemoryRouter>
    </CarritoProvider>
  );
}

function tarjetas() {
  return document.querySelectorAll('.card-producto');
}

describe('Productos (lista y filtros)', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it('muestra una tarjeta por cada producto del arreglo de datos', () => {
    montar(<Productos />, '/productos');
    expect(tarjetas().length).toBe(obtenerProductos().length);
  });

  it('el texto de la URL (?q=) filtra la lista', () => {
    montar(<Productos />, '/productos?q=botas');
    expect(tarjetas().length).toBe(1);
    expect(screen.getByText('Botas Combat Negras')).toBeTruthy();
  });

  it('la categoría de la URL (?categoria=) filtra la lista', () => {
    montar(<Productos />, '/productos?categoria=Chaquetas');
    expect(tarjetas().length).toBe(2);
  });

  it('muestra el contador de resultados', () => {
    montar(<Productos />, '/productos?q=botas');
    expect(screen.getByText('1 producto encontrado')).toBeTruthy();
  });

  it('muestra un mensaje solo cuando no hay resultados (renderizado condicional)', () => {
    montar(<Productos />, '/productos');
    expect(screen.queryByText('No encontramos productos con esos filtros.')).toBeNull();
    cleanup();
    montar(<Productos />, '/productos?q=zzzzzz');
    expect(screen.getByText('No encontramos productos con esos filtros.')).toBeTruthy();
    expect(tarjetas().length).toBe(0);
  });

  it('al escribir en el campo de búsqueda la lista se actualiza (evento + estado)', () => {
    montar(<Productos />, '/productos');
    fireEvent.change(screen.getByLabelText('Buscar'), { target: { value: 'cargo' } });
    expect(tarjetas().length).toBe(1);
    expect(screen.getByText('Cargo Pants Negro')).toBeTruthy();
  });

  it('al elegir una categoría en el select la lista se actualiza', () => {
    montar(<Productos />, '/productos');
    fireEvent.change(screen.getByLabelText('Categoría'), { target: { value: 'Calzado' } });
    expect(tarjetas().length).toBe(2);
  });

  it('al borrar el texto del buscador vuelve a mostrar todos los productos', () => {
    montar(<Productos />, '/productos?q=botas');
    expect(tarjetas().length).toBe(1);
    fireEvent.change(screen.getByLabelText('Buscar'), { target: { value: '' } });
    expect(tarjetas().length).toBe(obtenerProductos().length);
  });

  it('el botón Limpiar quita los filtros y vuelve a mostrar todo', () => {
    montar(<Productos />, '/productos?q=botas&categoria=Calzado');
    expect(tarjetas().length).toBe(1);
    fireEvent.click(screen.getByText('Limpiar'));
    expect(tarjetas().length).toBe(obtenerProductos().length);
  });
});

describe('Ofertas (lista)', () => {
  afterEach(cleanup);

  it('muestra solo los 4 productos en oferta, todos con la etiqueta Oferta', () => {
    montar(<Ofertas />, '/ofertas');
    expect(tarjetas().length).toBe(4);
    expect(screen.getAllByText('Oferta').length).toBe(4);
  });
});
