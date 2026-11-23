import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Admin from './Admin';
import { SesionProvider } from '../context/SesionContext';
import { ProductosProvider } from '../context/ProductosContext';
import { PRODUCTOS_DE_PRUEBA, comoBackend, listaComoBackend } from '../test-utils/productosDePrueba';
import { simularApi, llamadasA, sesionComo } from '../test-utils/simularApi';

const PEDIDOS = [
  { id: 1, clienteId: 3, productoId: 1, cantidad: 2, total: 17980, estadoPedido: 'PAGADO', fechaPedido: '2026-11-23' },
  { id: 2, clienteId: 3, productoId: 99, cantidad: 1, total: 5000, estadoPedido: 'PAGADO', fechaPedido: '2026-11-23' },
];

function montar() {
  render(
    <SesionProvider>
      <ProductosProvider productosIniciales={PRODUCTOS_DE_PRUEBA}>
        <MemoryRouter initialEntries={['/admin']}>
          <Admin />
        </MemoryRouter>
      </ProductosProvider>
    </SesionProvider>
  );
}

function filas(clase) {
  return document.querySelectorAll('.' + clase);
}

describe('Admin (panel por roles)', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  describe('acceso', () => {
    it('sin sesión muestra "Acceso restringido"', () => {
      montar();
      expect(screen.getByText('Acceso restringido')).toBeTruthy();
    });

    it('un CLIENTE tampoco puede entrar', () => {
      sesionComo('CLIENTE');
      montar();
      expect(screen.getByText('Acceso restringido')).toBeTruthy();
    });
  });

  describe('VENDEDOR', () => {
    beforeEach(() => sesionComo('VENDEDOR'));

    it('ve la lista de productos pero sin formulario ni botones de editar o eliminar', () => {
      montar();
      expect(screen.getByText('Panel de vendedor')).toBeTruthy();
      expect(filas('fila-producto-admin').length).toBe(PRODUCTOS_DE_PRUEBA.length);
      expect(screen.queryByText('Nuevo producto')).toBeNull();
      expect(screen.queryByText('Editar')).toBeNull();
      expect(screen.queryByText('Eliminar')).toBeNull();
    });

    it('no ve la pestaña de Clientes', () => {
      montar();
      expect(screen.queryByText('Clientes')).toBeNull();
    });

    it('puede ver el detalle de un producto (GET /productos/{id})', async () => {
      simularApi([{ ruta: '/productos/8', datos: comoBackend(PRODUCTOS_DE_PRUEBA[7]) }]);
      montar();
      fireEvent.click(screen.getAllByText('Ver')[7]);
      expect(await screen.findByText('Detalle del producto')).toBeTruthy();
      expect(screen.getByText('Código: CHA-001')).toBeTruthy();
      fireEvent.click(screen.getByText('Cerrar'));
      expect(screen.queryByText('Detalle del producto')).toBeNull();
    });

    it('si falla el detalle muestra el error', async () => {
      simularApi([{ ruta: '/productos/1', status: 404, datos: null }]);
      montar();
      fireEvent.click(screen.getAllByText('Ver')[0]);
      expect(await screen.findByText(/Error 404/)).toBeTruthy();
    });

    it('ve la lista de pedidos y su detalle', async () => {
      simularApi([
        { ruta: '/pedidos', datos: PEDIDOS },
        { ruta: '/pedidos/1', datos: PEDIDOS[0] },
      ]);
      montar();
      fireEvent.click(screen.getByText('Pedidos'));
      expect(screen.getByText('Cargando pedidos...')).toBeTruthy();
      await screen.findByText('Producto #99');
      expect(filas('fila-pedido-admin').length).toBe(2);
      fireEvent.click(screen.getAllByText('Ver')[0]);
      expect(await screen.findByText('Detalle del pedido #1')).toBeTruthy();
      expect(screen.getByText('Producto: Polera Oversize Negra')).toBeTruthy();
      fireEvent.click(screen.getByText('Cerrar'));
      expect(screen.queryByText('Detalle del pedido #1')).toBeNull();
    });

    it('sin pedidos muestra un aviso', async () => {
      simularApi([{ ruta: '/pedidos', datos: [] }]);
      montar();
      fireEvent.click(screen.getByText('Pedidos'));
      expect(await screen.findByText('Aún no hay pedidos registrados.')).toBeTruthy();
    });

    it('si el backend falla al listar pedidos muestra el error', async () => {
      simularApi([{ ruta: '/pedidos', status: 403, datos: { error: 'No tienes permisos para realizar esta accion' } }]);
      montar();
      fireEvent.click(screen.getByText('Pedidos'));
      expect(await screen.findByText('No tienes permisos para realizar esta accion')).toBeTruthy();
    });

    it('si falla el detalle de un pedido muestra el error', async () => {
      simularApi([
        { ruta: '/pedidos', datos: PEDIDOS },
        { ruta: '/pedidos/1', status: 500, datos: { error: 'Error interno' } },
      ]);
      montar();
      fireEvent.click(screen.getByText('Pedidos'));
      await screen.findByText('Producto #99');
      fireEvent.click(screen.getAllByText('Ver')[0]);
      expect(await screen.findByText('Error interno')).toBeTruthy();
    });
  });

  describe('ADMIN', () => {
    beforeEach(() => sesionComo('ADMIN'));

    it('ve el formulario, los botones de edición y la pestaña Clientes', () => {
      montar();
      expect(screen.getByText('Panel de administración')).toBeTruthy();
      expect(screen.getByText('Nuevo producto')).toBeTruthy();
      expect(screen.getAllByText('Editar').length).toBe(PRODUCTOS_DE_PRUEBA.length);
      expect(screen.getByText('Clientes')).toBeTruthy();
    });

    it('crea un producto con POST /productos y recarga la lista', async () => {
      const espia = simularApi([
        { ruta: '/productos', metodo: 'POST', status: 200, datos: { id: 12, codigo: 'TST-001', nombreProducto: 'Nuevo', descripcion: 'd', precio: 1000, stock: 2, categoria: 'Poleras', talla: 'M', imagen: '' } },
        { ruta: '/productos', datos: listaComoBackend() },
      ]);
      montar();
      fireEvent.change(screen.getByLabelText('Código'), { target: { value: 'TST-001' } });
      fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Nuevo' } });
      fireEvent.change(screen.getByLabelText('Categoría'), { target: { value: 'Poleras' } });
      fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: 'd' } });
      fireEvent.change(screen.getByLabelText('Precio'), { target: { value: '1000' } });
      fireEvent.change(screen.getByLabelText('Stock'), { target: { value: '2' } });
      fireEvent.change(screen.getByLabelText('Talla'), { target: { value: 'M' } });
      fireEvent.submit(screen.getByText('Crear producto').closest('form'));
      expect(await screen.findByText('Producto creado correctamente.')).toBeTruthy();
      const post = llamadasA(espia, 'POST', '/productos')[0];
      const cuerpo = JSON.parse(post[1].body);
      expect(cuerpo.nombreProducto).toBe('Nuevo');
      expect(cuerpo.precio).toBe(1000);
      expect(post[1].headers.Authorization).toBe('Bearer token-de-prueba');
      expect(llamadasA(espia, 'GET', '/productos').length).toBe(1);
    });

    it('editar carga el producto en el formulario y guarda con PUT /productos/{id}', async () => {
      const espia = simularApi([
        { ruta: '/productos/1', metodo: 'PUT', datos: comoBackend(PRODUCTOS_DE_PRUEBA[0]) },
        { ruta: '/productos', datos: listaComoBackend() },
      ]);
      montar();
      fireEvent.click(screen.getAllByText('Editar')[0]);
      expect(screen.getByText('Editar producto')).toBeTruthy();
      expect(screen.getByLabelText('Nombre').value).toBe('Polera Oversize Negra');
      fireEvent.change(screen.getByLabelText('Precio'), { target: { value: '7990' } });
      fireEvent.submit(screen.getByText('Guardar cambios').closest('form'));
      expect(await screen.findByText('Producto actualizado correctamente.')).toBeTruthy();
      const put = llamadasA(espia, 'PUT', '/productos/1')[0];
      expect(JSON.parse(put[1].body).precio).toBe(7990);
      expect(screen.getByText('Nuevo producto')).toBeTruthy();
    });

    it('Cancelar sale del modo edición', () => {
      montar();
      fireEvent.click(screen.getAllByText('Editar')[0]);
      fireEvent.click(screen.getByText('Cancelar'));
      expect(screen.getByText('Nuevo producto')).toBeTruthy();
      expect(screen.getByLabelText('Nombre').value).toBe('');
    });

    it('si el backend rechaza el guardado muestra el error', async () => {
      simularApi([{ ruta: '/productos', metodo: 'POST', status: 500, datos: { error: 'Internal Server Error' } }]);
      montar();
      fireEvent.submit(screen.getByText('Crear producto').closest('form'));
      expect(await screen.findByText('Internal Server Error')).toBeTruthy();
    });

    it('eliminar pide confirmación y llama a DELETE /productos/{id}', async () => {
      const espia = simularApi([
        { ruta: '/productos/1', metodo: 'DELETE', status: 204, datos: null },
        { ruta: '/productos/1', datos: comoBackend(PRODUCTOS_DE_PRUEBA[0]) },
        { ruta: '/productos', datos: listaComoBackend() },
      ]);
      montar();
      fireEvent.click(screen.getAllByText('Ver')[0]);
      await screen.findByText('Detalle del producto');
      fireEvent.click(screen.getAllByText('Eliminar')[0]);
      expect(screen.getByText('Confirmar eliminación')).toBeTruthy();
      fireEvent.click(screen.getByText('Sí, eliminar'));
      expect(await screen.findByText('Producto eliminado.')).toBeTruthy();
      expect(llamadasA(espia, 'DELETE', '/productos/1').length).toBe(1);
      expect(screen.queryByText('Confirmar eliminación')).toBeNull();
      expect(screen.queryByText('Detalle del producto')).toBeNull();
    });

    it('cancelar la eliminación no llama al backend', () => {
      const espia = spyOn(window, 'fetch');
      montar();
      fireEvent.click(screen.getAllByText('Eliminar')[0]);
      const modal = document.querySelector('.modal-footer');
      fireEvent.click(within(modal).getByText('Cancelar'));
      expect(screen.queryByText('Confirmar eliminación')).toBeNull();
      expect(espia).not.toHaveBeenCalled();
    });

    it('si falla la eliminación muestra el error', async () => {
      simularApi([{ ruta: '/productos/1', metodo: 'DELETE', status: 500, datos: { error: 'No se pudo eliminar' } }]);
      montar();
      fireEvent.click(screen.getAllByText('Eliminar')[0]);
      fireEvent.click(screen.getByText('Sí, eliminar'));
      expect(await screen.findByText('No se pudo eliminar')).toBeTruthy();
    });

    it('la pestaña Clientes lista los clientes (GET /clientes)', async () => {
      simularApi([{ ruta: '/clientes', datos: [{ id: 2, nombreCompleto: 'Ana Pérez', correo: 'ana@correo.cl', telefono: '912345678' }] }]);
      montar();
      fireEvent.click(screen.getByText('Clientes'));
      expect(screen.getByText('Cargando clientes...')).toBeTruthy();
      expect(await screen.findByText('Ana Pérez')).toBeTruthy();
      expect(filas('fila-cliente-admin').length).toBe(1);
    });

    it('sin clientes muestra un aviso', async () => {
      simularApi([{ ruta: '/clientes', datos: [] }]);
      montar();
      fireEvent.click(screen.getByText('Clientes'));
      expect(await screen.findByText('Aún no hay clientes registrados.')).toBeTruthy();
    });

    it('si falla la lista de clientes muestra el error', async () => {
      simularApi([{ ruta: '/clientes', status: 401, datos: { error: 'Token invalido, expirado o no enviado' } }]);
      montar();
      fireEvent.click(screen.getByText('Clientes'));
      expect(await screen.findByText('Token invalido, expirado o no enviado')).toBeTruthy();
    });
  });
});
