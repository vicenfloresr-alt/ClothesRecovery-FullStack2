import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ProductosProvider, useProductos } from './ProductosContext';
import { PRODUCTOS_DE_PRUEBA, listaComoBackend } from '../test-utils/productosDePrueba';
import { simularApi } from '../test-utils/simularApi';

function Panel() {
  const { productos, cargando, error, recargarProductos } = useProductos();
  return (
    <div>
      <span data-testid="cantidad">{productos.length}</span>
      <span data-testid="cargando">{cargando ? 'si' : 'no'}</span>
      <span data-testid="error">{error}</span>
      <button onClick={() => recargarProductos()}>recargar</button>
    </div>
  );
}

describe('ProductosContext', () => {
  afterEach(cleanup);

  it('al montar pide los productos al backend y los deja disponibles', async () => {
    const espia = simularApi([{ ruta: '/productos', datos: listaComoBackend() }]);
    render(<ProductosProvider><Panel /></ProductosProvider>);
    expect(screen.getByTestId('cargando').textContent).toBe('si');
    expect(await screen.findByText('11')).toBeTruthy();
    expect(screen.getByTestId('cargando').textContent).toBe('no');
    expect(espia).toHaveBeenCalledTimes(1);
  });

  it('si el backend no responde muestra un mensaje de error', async () => {
    simularApi([{ ruta: '/productos', falla: true }]);
    render(<ProductosProvider><Panel /></ProductosProvider>);
    expect(await screen.findByText(/No se pudo conectar con el servidor/)).toBeTruthy();
    expect(screen.getByTestId('cantidad').textContent).toBe('0');
  });

  it('con productosIniciales no llama al backend (útil para pruebas)', () => {
    const espia = spyOn(window, 'fetch');
    render(<ProductosProvider productosIniciales={PRODUCTOS_DE_PRUEBA}><Panel /></ProductosProvider>);
    expect(screen.getByTestId('cantidad').textContent).toBe('11');
    expect(screen.getByTestId('cargando').textContent).toBe('no');
    expect(espia).not.toHaveBeenCalled();
  });

  it('recargarProductos vuelve a pedir la lista y quita el error anterior', async () => {
    let intentos = 0;
    spyOn(window, 'fetch').and.callFake(() => {
      intentos++;
      if (intentos === 1) {
        return Promise.reject(new TypeError('Failed to fetch'));
      }
      return Promise.resolve(new Response(JSON.stringify(listaComoBackend()), { status: 200 }));
    });
    render(<ProductosProvider><Panel /></ProductosProvider>);
    expect(await screen.findByText(/No se pudo conectar/)).toBeTruthy();
    fireEvent.click(screen.getByText('recargar'));
    expect(await screen.findByText('11')).toBeTruthy();
    expect(screen.getByTestId('error').textContent).toBe('');
  });

  it('sin proveedor entrega una lista vacía', () => {
    render(<Panel />);
    expect(screen.getByTestId('cantidad').textContent).toBe('0');
  });
});
