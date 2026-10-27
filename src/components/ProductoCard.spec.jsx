import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductoCard from './ProductoCard';
import { obtenerProductoPorCodigo, calcularPrecioOferta, formatearPrecio } from '../data/productos';

function montar(codigo, onAgregar) {
  const producto = obtenerProductoPorCodigo(codigo);
  render(
    <MemoryRouter>
      <ProductoCard producto={producto} onAgregar={onAgregar} />
    </MemoryRouter>
  );
  return producto;
}

describe('ProductoCard', () => {
  afterEach(cleanup);

  it('muestra el nombre y el precio del producto', () => {
    const producto = montar('POL-001', () => true);
    expect(screen.getByText(producto.nombre)).toBeTruthy();
    expect(screen.getByText(formatearPrecio(producto.precio))).toBeTruthy();
  });

  it('un producto sin oferta no muestra la etiqueta Oferta', () => {
    montar('POL-001', () => true);
    expect(screen.queryByText('Oferta')).toBeNull();
  });

  it('un producto en oferta muestra la etiqueta, el precio anterior y el precio con descuento', () => {
    const producto = montar('POL-002', () => true);
    expect(screen.getByText('Oferta')).toBeTruthy();
    expect(screen.getByText(formatearPrecio(producto.precio))).toBeTruthy();
    expect(screen.getByText(formatearPrecio(calcularPrecioOferta(producto.precio)))).toBeTruthy();
  });

  it('al hacer clic llama a onAgregar con el precio que se cobra', () => {
    let recibido = null;
    const producto = montar('POL-002', (p) => {
      recibido = p;
      return true;
    });
    fireEvent.click(screen.getByText('Añadir al carrito'));
    expect(recibido.codigo).toBe('POL-002');
    expect(recibido.precio).toBe(calcularPrecioOferta(producto.precio));
  });

  it('si onAgregar devuelve false avisa que ya está todo el stock en el carrito', () => {
    montar('POL-001', () => false);
    fireEvent.click(screen.getByText('Añadir al carrito'));
    expect(screen.getByText('Ya tienes todo el stock en tu carrito.')).toBeTruthy();
  });

  it('el enlace del producto apunta a su página de detalle', () => {
    montar('POL-001', () => true);
    const enlaces = document.querySelectorAll('a');
    expect(enlaces[0].getAttribute('href')).toBe('/productos/POL-001');
  });
});
