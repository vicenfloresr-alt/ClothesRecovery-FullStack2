import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Comprar from './Comprar';
import { CarritoProvider } from '../context/CarritoContext';
import { SesionProvider } from '../context/SesionContext';
import { ProductosProvider } from '../context/ProductosContext';
import { obtenerPedidos, eliminarPedido } from '../data/pedidos';
import { PRODUCTOS_DE_PRUEBA, comoBackend, listaComoBackend } from '../test-utils/productosDePrueba';
import { simularApi, llamadasA, sesionComo } from '../test-utils/simularApi';

const carritoConUnProducto = [
  { id: 1, codigo: 'POL-001', nombre: 'Polera Oversize Negra', precio: 8990, imagen: '/a.jpg', cantidad: 1 },
];

function montar() {
  render(
    <SesionProvider>
      <ProductosProvider productosIniciales={PRODUCTOS_DE_PRUEBA}>
        <CarritoProvider>
          <MemoryRouter initialEntries={['/comprar']}>
            <Routes>
              <Route path="/comprar" element={<Comprar />} />
              <Route path="/comprar/ok/:numero" element={<h1>PAGO-OK</h1>} />
              <Route path="/comprar/error/:numero" element={<h1>PAGO-ERROR</h1>} />
            </Routes>
          </MemoryRouter>
        </CarritoProvider>
      </ProductosProvider>
    </SesionProvider>
  );
}

function backendOk() {
  return simularApi([
    { ruta: '/productos/1/descontar/1', metodo: 'PUT', datos: { ...comoBackend(PRODUCTOS_DE_PRUEBA[0]), stock: 7 } },
    { ruta: '/pedidos', metodo: 'POST', datos: { id: 50 } },
    { ruta: '/productos', datos: listaComoBackend() },
  ]);
}

describe('Comprar (checkout contra el backend)', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it('con el carrito vacío muestra el aviso y no el formulario', () => {
    montar();
    expect(screen.getByText('Tu carrito está vacío')).toBeTruthy();
    expect(screen.queryByText('Información del cliente')).toBeNull();
  });

  it('sin sesión pide iniciar sesión antes de comprar', () => {
    localStorage.setItem('carrito-clothesrecovery', JSON.stringify(carritoConUnProducto));
    montar();
    expect(screen.getByText('Inicia sesión para comprar')).toBeTruthy();
    expect(screen.queryByText('Información del cliente')).toBeNull();
  });

  it('un ADMIN no puede comprar porque no es cliente', () => {
    localStorage.setItem('carrito-clothesrecovery', JSON.stringify(carritoConUnProducto));
    sesionComo('ADMIN');
    montar();
    expect(screen.getByText('Inicia sesión para comprar')).toBeTruthy();
  });

  it('con sesión de cliente completa el nombre y el correo', () => {
    localStorage.setItem('carrito-clothesrecovery', JSON.stringify(carritoConUnProducto));
    sesionComo('CLIENTE');
    montar();
    expect(screen.getByLabelText(/Nombre/).value).toBe('Ana Pérez');
    expect(screen.getByLabelText(/Correo/).value).toBe('cliente@clothesrecovery.cl');
    expect(screen.getByLabelText(/Apellidos/).value).toBe('');
  });

  it('el botón de pago muestra el total a pagar', () => {
    localStorage.setItem('carrito-clothesrecovery', JSON.stringify(carritoConUnProducto));
    sesionComo('CLIENTE');
    montar();
    expect(screen.getByText(/Pagar ahora/).textContent).toContain('8');
  });

  it('al escribir en los campos del cliente el formulario se actualiza (formulario controlado)', () => {
    localStorage.setItem('carrito-clothesrecovery', JSON.stringify(carritoConUnProducto));
    sesionComo('CLIENTE');
    montar();
    fireEvent.change(screen.getByLabelText(/Nombre/), { target: { value: 'Vicente' } });
    fireEvent.change(screen.getByLabelText(/Apellidos/), { target: { value: 'Flores' } });
    expect(screen.getByLabelText(/Nombre/).value).toBe('Vicente');
    expect(screen.getByLabelText(/Apellidos/).value).toBe('Flores');
  });

  describe('pago (pasarela simulada + backend)', () => {
    let numerosAntes = [];

    beforeEach(() => {
      numerosAntes = obtenerPedidos().map((p) => p.numero);
    });

    afterEach(() => {
      const nuevos = pedidosNuevos();
      for (let i = 0; i < nuevos.length; i++) {
        eliminarPedido(nuevos[i].numero);
      }
    });

    function pagar() {
      fireEvent.submit(screen.getByText(/Pagar ahora/).closest('form'));
    }

    function pedidosNuevos() {
      return obtenerPedidos().filter((p) => numerosAntes.indexOf(p.numero) === -1);
    }

    it('con un monto aceptado descuenta stock, crea el pedido en el backend, muestra "pago ok" y vacía el carrito', async () => {
      localStorage.setItem('carrito-clothesrecovery', JSON.stringify(carritoConUnProducto));
      sesionComo('CLIENTE');
      const espia = backendOk();
      montar();
      pagar();
      expect(await screen.findByText('PAGO-OK')).toBeTruthy();

      expect(llamadasA(espia, 'PUT', '/productos/1/descontar/1').length).toBe(1);
      const posts = llamadasA(espia, 'POST', '/pedidos');
      expect(posts.length).toBe(1);
      const cuerpo = JSON.parse(posts[0][1].body);
      expect(cuerpo.clienteId).toBe(3);
      expect(cuerpo.productoId).toBe(1);
      expect(cuerpo.total).toBe(8990);
      expect(cuerpo.estadoPedido).toBe('PAGADO');
      expect(posts[0][1].headers.Authorization).toBe('Bearer token-de-prueba');

      expect(pedidosNuevos()[0].estado).toBe('pagado');
      await waitFor(() => {
        if (JSON.parse(localStorage.getItem('carrito-clothesrecovery')).length !== 0) {
          throw new Error('el carrito aún no se vacía');
        }
      });
      expect(JSON.parse(localStorage.getItem('carrito-clothesrecovery')).length).toBe(0);
    });

    it('si el carrito viene de antes sin id, usa el id del catálogo cargado', async () => {
      localStorage.setItem('carrito-clothesrecovery', JSON.stringify([{ codigo: 'POL-001', nombre: 'Polera', precio: 8990, imagen: '/a.jpg', cantidad: 1 }]));
      sesionComo('CLIENTE');
      const espia = backendOk();
      montar();
      pagar();
      await screen.findByText('PAGO-OK');
      expect(llamadasA(espia, 'PUT', '/productos/1/descontar/1').length).toBe(1);
    });

    it('con un monto sobre $150.000 muestra "pago error", no llama al backend y mantiene el carrito', async () => {
      const carritoGrande = [
        { id: 10, codigo: 'CAL-001', nombre: 'Botas', precio: 34990, imagen: '/a.jpg', cantidad: 4 },
        { id: 9, codigo: 'CHA-002', nombre: 'Bomber', precio: 27990, imagen: '/b.jpg', cantidad: 3 },
      ];
      localStorage.setItem('carrito-clothesrecovery', JSON.stringify(carritoGrande));
      sesionComo('CLIENTE');
      const espia = spyOn(window, 'fetch');
      montar();
      pagar();
      expect(await screen.findByText('PAGO-ERROR')).toBeTruthy();
      expect(espia).not.toHaveBeenCalled();
      expect(pedidosNuevos()[0].estado).toBe('rechazado');
      expect(JSON.parse(localStorage.getItem('carrito-clothesrecovery')).length).toBe(2);
    });

    it('si la cantidad del carrito supera el stock, el pago se rechaza aunque el monto sea bajo', async () => {
      const carritoSinStock = [
        { id: 8, codigo: 'CHA-001', nombre: 'Chaqueta', precio: 19992, imagen: '/a.jpg', cantidad: 5 },
      ];
      localStorage.setItem('carrito-clothesrecovery', JSON.stringify(carritoSinStock));
      sesionComo('CLIENTE');
      montar();
      pagar();
      expect(await screen.findByText('PAGO-ERROR')).toBeTruthy();
      expect(pedidosNuevos()[0].estado).toBe('rechazado');
    });

    it('si el backend rechaza el descuento de stock, el pago falla con el motivo del backend', async () => {
      localStorage.setItem('carrito-clothesrecovery', JSON.stringify(carritoConUnProducto));
      sesionComo('CLIENTE');
      const espia = simularApi([
        { ruta: '/productos/1/descontar/1', metodo: 'PUT', status: 400, datos: { error: 'Stock insuficiente para Polera Oversize Negra. Disponible: 0' } },
        { ruta: '/productos', datos: listaComoBackend() },
      ]);
      montar();
      pagar();
      expect(await screen.findByText('PAGO-ERROR')).toBeTruthy();
      expect(llamadasA(espia, 'POST', '/pedidos').length).toBe(0);
      expect(pedidosNuevos()[0].motivo).toContain('Stock insuficiente');
      expect(JSON.parse(localStorage.getItem('carrito-clothesrecovery')).length).toBe(1);
    });

    it('el comprobante guarda los datos del cliente y la dirección del formulario', async () => {
      localStorage.setItem('carrito-clothesrecovery', JSON.stringify(carritoConUnProducto));
      sesionComo('CLIENTE');
      backendOk();
      montar();
      fireEvent.change(screen.getByLabelText(/Calle/), { target: { value: 'Av. Siempre Viva 123' } });
      fireEvent.change(screen.getByLabelText(/Región/), { target: { value: '1000' } });
      pagar();
      await screen.findByText('PAGO-OK');
      const pedido = pedidosNuevos()[0];
      expect(pedido.cliente.correo).toBe('cliente@clothesrecovery.cl');
      expect(pedido.direccion.calle).toBe('Av. Siempre Viva 123');
      expect(pedido.direccion.region).toBe(1000);
      expect(pedido.total).toBe(8990);
    });
  });
});
