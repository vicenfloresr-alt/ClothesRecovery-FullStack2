import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Comprar from './Comprar';
import { CarritoProvider } from '../context/CarritoContext';
import { SesionProvider } from '../context/SesionContext';
import { obtenerProductoPorCodigo, editarProducto } from '../data/productos';
import { obtenerPedidos, eliminarPedido } from '../data/pedidos';

const carritoConUnProducto = [
  { codigo: 'POL-001', nombre: 'Polera Oversize Negra', precio: 8990, imagen: '/a.jpg', cantidad: 1 },
];

const sesionDePrueba = {
  nombre: 'Ana',
  apellidos: 'Pérez',
  correo: 'ana@correo.cl',
  direccion: { calle: 'Av. Siempre Viva 123', departamento: '603', region: 1000, comuna: 1001, indicaciones: 'Tocar timbre' },
};

function montar() {
  render(
    <SesionProvider>
      <CarritoProvider>
        <MemoryRouter initialEntries={['/comprar']}>
          <Routes>
            <Route path="/comprar" element={<Comprar />} />
            <Route path="/comprar/ok/:numero" element={<h1>PAGO-OK</h1>} />
            <Route path="/comprar/error/:numero" element={<h1>PAGO-ERROR</h1>} />
          </Routes>
        </MemoryRouter>
      </CarritoProvider>
    </SesionProvider>
  );
}

describe('Comprar (checkout)', () => {
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

  it('sin sesión el formulario parte vacío', () => {
    localStorage.setItem('carrito-clothesrecovery', JSON.stringify(carritoConUnProducto));
    montar();
    expect(screen.getByLabelText(/Nombre/).value).toBe('');
    expect(screen.getByLabelText(/Correo/).value).toBe('');
    expect(screen.getByLabelText(/Calle/).value).toBe('');
  });

  it('con sesión iniciada completa solos los datos del cliente y la dirección', () => {
    localStorage.setItem('carrito-clothesrecovery', JSON.stringify(carritoConUnProducto));
    localStorage.setItem('sesion-clothesrecovery', JSON.stringify(sesionDePrueba));
    montar();
    expect(screen.getByLabelText(/Nombre/).value).toBe('Ana');
    expect(screen.getByLabelText(/Apellidos/).value).toBe('Pérez');
    expect(screen.getByLabelText(/Correo/).value).toBe('ana@correo.cl');
    expect(screen.getByLabelText(/Calle/).value).toBe('Av. Siempre Viva 123');
    expect(screen.getByLabelText(/Región/).value).toBe('1000');
    expect(screen.getByLabelText(/Comuna/).value).toBe('1001');
  });

  it('el botón de pago muestra el total a pagar', () => {
    localStorage.setItem('carrito-clothesrecovery', JSON.stringify(carritoConUnProducto));
    montar();
    expect(screen.getByText(/Pagar ahora/).textContent).toContain('8');
  });

  it('al escribir en los campos del cliente el formulario se actualiza (formulario controlado)', () => {
    localStorage.setItem('carrito-clothesrecovery', JSON.stringify(carritoConUnProducto));
    montar();
    fireEvent.change(screen.getByLabelText(/Nombre/), { target: { value: 'Vicente' } });
    fireEvent.change(screen.getByLabelText(/Correo/), { target: { value: 'v@correo.cl' } });
    expect(screen.getByLabelText(/Nombre/).value).toBe('Vicente');
    expect(screen.getByLabelText(/Correo/).value).toBe('v@correo.cl');
  });

  describe('pago (pasarela simulada)', () => {
    let numerosAntes = [];
    let stockOriginal = {};

    // Guarda el estado inicial para dejar todo como estaba al terminar
    beforeEach(() => {
      numerosAntes = obtenerPedidos().map((p) => p.numero);
      stockOriginal = {
        'POL-001': obtenerProductoPorCodigo('POL-001').stock,
        'CHA-001': obtenerProductoPorCodigo('CHA-001').stock,
        'CAL-001': obtenerProductoPorCodigo('CAL-001').stock,
        'CHA-002': obtenerProductoPorCodigo('CHA-002').stock,
      };
    });

    afterEach(() => {
      const nuevos = obtenerPedidos().filter((p) => numerosAntes.indexOf(p.numero) === -1);
      for (let i = 0; i < nuevos.length; i++) {
        eliminarPedido(nuevos[i].numero);
      }
      for (const codigo in stockOriginal) {
        editarProducto(codigo, { stock: stockOriginal[codigo] });
      }
    });

    function pagar() {
      fireEvent.submit(screen.getByText(/Pagar ahora/).closest('form'));
    }

    function pedidosNuevos() {
      return obtenerPedidos().filter((p) => numerosAntes.indexOf(p.numero) === -1);
    }

    it('con un monto aceptado muestra "pago ok", guarda el pedido como pagado, baja el stock y vacía el carrito', () => {
      localStorage.setItem('carrito-clothesrecovery', JSON.stringify(carritoConUnProducto));
      localStorage.setItem('sesion-clothesrecovery', JSON.stringify(sesionDePrueba));
      montar();
      pagar();
      expect(screen.getByText('PAGO-OK')).toBeTruthy();
      expect(pedidosNuevos().length).toBe(1);
      expect(pedidosNuevos()[0].estado).toBe('pagado');
      expect(obtenerProductoPorCodigo('POL-001').stock).toBe(stockOriginal['POL-001'] - 1);
      expect(JSON.parse(localStorage.getItem('carrito-clothesrecovery')).length).toBe(0);
    });

    it('con un monto sobre $150.000 muestra "pago error", guarda el pedido como rechazado y mantiene el carrito y el stock', () => {
      const carritoGrande = [
        { codigo: 'CAL-001', nombre: 'Botas', precio: 34990, imagen: '/a.jpg', cantidad: 4 },
        { codigo: 'CHA-002', nombre: 'Bomber', precio: 27990, imagen: '/b.jpg', cantidad: 3 },
      ];
      localStorage.setItem('carrito-clothesrecovery', JSON.stringify(carritoGrande));
      localStorage.setItem('sesion-clothesrecovery', JSON.stringify(sesionDePrueba));
      montar();
      pagar();
      expect(screen.getByText('PAGO-ERROR')).toBeTruthy();
      expect(pedidosNuevos()[0].estado).toBe('rechazado');
      expect(obtenerProductoPorCodigo('CAL-001').stock).toBe(stockOriginal['CAL-001']);
      expect(JSON.parse(localStorage.getItem('carrito-clothesrecovery')).length).toBe(2);
    });

    it('si la cantidad del carrito supera el stock, el pago se rechaza aunque el monto sea bajo', () => {
      const carritoSinStock = [
        { codigo: 'CHA-001', nombre: 'Chaqueta', precio: 19992, imagen: '/a.jpg', cantidad: 5 },
      ];
      localStorage.setItem('carrito-clothesrecovery', JSON.stringify(carritoSinStock));
      localStorage.setItem('sesion-clothesrecovery', JSON.stringify(sesionDePrueba));
      montar();
      pagar();
      expect(screen.getByText('PAGO-ERROR')).toBeTruthy();
      expect(pedidosNuevos()[0].estado).toBe('rechazado');
    });

    it('el pedido guarda los datos del cliente y la dirección del formulario', () => {
      localStorage.setItem('carrito-clothesrecovery', JSON.stringify(carritoConUnProducto));
      localStorage.setItem('sesion-clothesrecovery', JSON.stringify(sesionDePrueba));
      montar();
      pagar();
      const pedido = pedidosNuevos()[0];
      expect(pedido.cliente.correo).toBe('ana@correo.cl');
      expect(pedido.direccion.calle).toBe('Av. Siempre Viva 123');
      expect(pedido.direccion.region).toBe(1000);
      expect(pedido.total).toBe(8990);
    });
  });
});
