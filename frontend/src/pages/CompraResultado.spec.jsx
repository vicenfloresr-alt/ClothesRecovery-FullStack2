import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CompraResultado from './CompraResultado';
import { agregarPedido, eliminarPedido } from '../data/pedidos';

function montarConPedido(exito, total) {
  const pedido = agregarPedido({
    estado: exito ? 'pagado' : 'rechazado',
    cliente: { nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@correo.cl' },
    direccion: { calle: 'Calle 1', departamento: '', region: 1000, comuna: 1001, indicaciones: '' },
    items: [{ codigo: 'POL-001', nombre: 'Polera Oversize Negra', precio: 8990, imagen: '/a.jpg', cantidad: 2 }],
    total: total,
  });
  render(
    <MemoryRouter initialEntries={['/resultado/' + pedido.numero]}>
      <Routes>
        <Route path="/resultado/:numero" element={<CompraResultado exito={exito} />} />
      </Routes>
    </MemoryRouter>
  );
  return pedido;
}

describe('CompraResultado', () => {
  let pedido = null;

  afterEach(() => {
    cleanup();
    if (pedido !== null) {
      eliminarPedido(pedido.numero);
      pedido = null;
    }
  });

  it('con exito=true muestra "Se ha realizado la compra" y el número de pedido', () => {
    pedido = montarConPedido(true, 17980);
    expect(screen.getByText(new RegExp('Se ha realizado la compra. nro #' + pedido.numero))).toBeTruthy();
    expect(screen.getByText('Imprimir boleta en PDF')).toBeTruthy();
  });

  it('con exito=false muestra "No se pudo realizar el pago" y el botón de reintento', () => {
    pedido = montarConPedido(false, 17980);
    expect(screen.getByText(new RegExp('No se pudo realizar el pago. nro #' + pedido.numero))).toBeTruthy();
    expect(screen.getByText('VOLVER A REALIZAR EL PAGO')).toBeTruthy();
  });

  it('en el error por monto explica el límite de pago', () => {
    pedido = montarConPedido(false, 200000);
    expect(screen.getByText(/supera el límite/)).toBeTruthy();
  });

  it('en el error por stock explica que falta stock', () => {
    pedido = montarConPedido(false, 17980);
    expect(screen.getByText(/ya no tiene stock suficiente/)).toBeTruthy();
  });

  it('muestra el nombre del cliente y el producto comprado', () => {
    pedido = montarConPedido(true, 17980);
    expect(screen.getByDisplayValue('Ana')).toBeTruthy();
    expect(screen.getByText('Polera Oversize Negra')).toBeTruthy();
  });

  it('muestra "Pedido no encontrado" si el número no existe', () => {
    render(
      <MemoryRouter initialEntries={['/resultado/1']}>
        <Routes>
          <Route path="/resultado/:numero" element={<CompraResultado exito={true} />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Pedido no encontrado')).toBeTruthy();
  });

  it('"Imprimir boleta en PDF" llama a window.print (mock para no abrir el diálogo real)', () => {
    const espia = spyOn(window, 'print');
    pedido = montarConPedido(true, 17980);
    fireEvent.click(screen.getByText('Imprimir boleta en PDF'));
    expect(espia).toHaveBeenCalledTimes(1);
  });

  it('"Enviar boleta por email" muestra el mensaje con el correo del cliente', () => {
    pedido = montarConPedido(true, 17980);
    expect(screen.queryByText(/Se ha enviado la boleta/)).toBeNull();
    fireEvent.click(screen.getByText('Enviar boleta por email'));
    expect(screen.getByText('Se ha enviado la boleta a ana@correo.cl')).toBeTruthy();
  });
});
