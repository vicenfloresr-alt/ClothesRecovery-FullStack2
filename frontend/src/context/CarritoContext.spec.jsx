import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { CarritoProvider, useCarrito } from './CarritoContext';

function Panel() {
  const { items, agregarAlCarrito, cambiarCantidad, eliminarDelCarrito, vaciarCarrito, totalUnidades, totalPrecio } = useCarrito();
  const chaqueta = { codigo: 'CHA-001', nombre: 'Chaqueta', precio: 1000, imagen: '/a.jpg' };
  const polera = { codigo: 'POL-001', nombre: 'Polera', precio: 500, imagen: '/b.jpg' };
  const inexistente = { codigo: 'XXX-999', nombre: 'Nada', precio: 1, imagen: '/c.jpg' };
  let ultimo = '';
  return (
    <div>
      <span data-testid="unidades">{totalUnidades}</span>
      <span data-testid="total">{totalPrecio}</span>
      <span data-testid="lineas">{items.length}</span>
      <span data-testid="resultado">{ultimo}</span>
      <button onClick={() => agregarAlCarrito(chaqueta)}>add-cha</button>
      <button onClick={() => agregarAlCarrito(polera)}>add-pol</button>
      <button onClick={() => { document.body.dataset.res = String(agregarAlCarrito(inexistente)); }}>add-nada</button>
      <button onClick={() => { document.body.dataset.res = String(agregarAlCarrito(chaqueta)); }}>add-cha-res</button>
      <button onClick={() => cambiarCantidad('POL-001', 5)}>cant-5</button>
      <button onClick={() => cambiarCantidad('POL-001', 99)}>cant-99</button>
      <button onClick={() => cambiarCantidad('POL-001', 0)}>cant-0</button>
      <button onClick={() => eliminarDelCarrito('POL-001')}>quitar-pol</button>
      <button onClick={() => vaciarCarrito()}>vaciar</button>
    </div>
  );
}

function montar() {
  return render(
    <CarritoProvider>
      <Panel />
    </CarritoProvider>
  );
}

function texto(id) {
  return screen.getByTestId(id).textContent;
}

describe('CarritoContext', () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.body.dataset.res;
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it('parte con el carrito vacío', () => {
    montar();
    expect(texto('unidades')).toBe('0');
    expect(texto('total')).toBe('0');
  });

  it('agregar un producto suma 1 unidad y el precio', () => {
    montar();
    fireEvent.click(screen.getByText('add-pol'));
    expect(texto('unidades')).toBe('1');
    expect(texto('total')).toBe('500');
  });

  it('agregar el mismo producto dos veces sube la cantidad, no crea otra línea', () => {
    montar();
    fireEvent.click(screen.getByText('add-pol'));
    fireEvent.click(screen.getByText('add-pol'));
    expect(texto('lineas')).toBe('1');
    expect(texto('unidades')).toBe('2');
    expect(texto('total')).toBe('1000');
  });

  it('no deja agregar más unidades que el stock (CHA-001 tiene 2)', () => {
    montar();
    fireEvent.click(screen.getByText('add-cha'));
    fireEvent.click(screen.getByText('add-cha'));
    fireEvent.click(screen.getByText('add-cha-res'));
    expect(texto('unidades')).toBe('2');
    expect(document.body.dataset.res).toBe('false');
  });

  it('agregarAlCarrito devuelve false si el producto no existe (sin stock)', () => {
    montar();
    fireEvent.click(screen.getByText('add-nada'));
    expect(document.body.dataset.res).toBe('false');
    expect(texto('unidades')).toBe('0');
  });

  it('cambiarCantidad actualiza la cantidad dentro del stock', () => {
    montar();
    fireEvent.click(screen.getByText('add-pol'));
    fireEvent.click(screen.getByText('cant-5'));
    expect(texto('unidades')).toBe('5');
    expect(texto('total')).toBe('2500');
  });

  it('cambiarCantidad ignora una cantidad mayor al stock o menor a 1', () => {
    montar();
    fireEvent.click(screen.getByText('add-pol'));
    fireEvent.click(screen.getByText('cant-99'));
    expect(texto('unidades')).toBe('1');
    fireEvent.click(screen.getByText('cant-0'));
    expect(texto('unidades')).toBe('1');
  });

  it('eliminarDelCarrito quita solo ese producto', () => {
    montar();
    fireEvent.click(screen.getByText('add-pol'));
    fireEvent.click(screen.getByText('add-cha'));
    fireEvent.click(screen.getByText('quitar-pol'));
    expect(texto('lineas')).toBe('1');
    expect(texto('total')).toBe('1000');
  });

  it('vaciarCarrito deja todo en cero', () => {
    montar();
    fireEvent.click(screen.getByText('add-pol'));
    fireEvent.click(screen.getByText('add-cha'));
    fireEvent.click(screen.getByText('vaciar'));
    expect(texto('lineas')).toBe('0');
    expect(texto('total')).toBe('0');
  });

  it('guarda el carrito en localStorage', () => {
    montar();
    fireEvent.click(screen.getByText('add-pol'));
    const guardado = JSON.parse(localStorage.getItem('carrito-clothesrecovery'));
    expect(guardado.length).toBe(1);
    expect(guardado[0].codigo).toBe('POL-001');
  });

  it('recupera el carrito guardado al volver a montar (simula recargar)', () => {
    montar();
    fireEvent.click(screen.getByText('add-pol'));
    cleanup();
    montar();
    expect(texto('unidades')).toBe('1');
  });

  it('guarda en localStorage usando setItem con la clave del carrito (espía)', () => {
    montar();
    const espia = spyOn(Storage.prototype, 'setItem').and.callThrough();
    fireEvent.click(screen.getByText('add-pol'));
    expect(espia).toHaveBeenCalledWith('carrito-clothesrecovery', jasmine.any(String));
  });

  it('si localStorage falla, el carrito sigue funcionando en memoria', () => {
    montar();
    spyOn(Storage.prototype, 'setItem').and.throwError('almacenamiento lleno');
    fireEvent.click(screen.getByText('add-pol'));
    expect(texto('unidades')).toBe('1');
  });
});
