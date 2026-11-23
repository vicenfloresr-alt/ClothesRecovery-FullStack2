import {
  formatearPrecio,
  estaEnOferta,
  calcularPrecioOferta,
  obtenerPrecioFinal,
  convertirDesdeBackend,
  convertirParaBackend,
  listarProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  descontarStock,
  obtenerProductoPorCodigo,
  obtenerProductosPorCategoria,
  obtenerProductosEnOferta,
  buscarProductos,
  CODIGOS_EN_OFERTA,
  PORCENTAJE_DESCUENTO,
} from './productos';
import { PRODUCTOS_DE_PRUEBA, comoBackend, listaComoBackend } from '../test-utils/productosDePrueba';
import { simularApi, cuerpoEnviado } from '../test-utils/simularApi';

const lista = PRODUCTOS_DE_PRUEBA;

describe('productos.js', () => {
  describe('formatearPrecio', () => {
    it('agrega el signo $ al número', () => {
      expect(formatearPrecio(500).charAt(0)).toBe('$');
    });

    it('incluye todos los dígitos del precio', () => {
      expect(formatearPrecio(8990).replace(/\D/g, '')).toBe('8990');
    });
  });

  describe('ofertas', () => {
    it('reconoce un código que está en oferta', () => {
      expect(estaEnOferta('POL-002')).toBeTrue();
    });

    it('reconoce un código que NO está en oferta', () => {
      expect(estaEnOferta('POL-001')).toBeFalse();
    });

    it('el descuento es del 20%', () => {
      expect(PORCENTAJE_DESCUENTO).toBe(20);
    });

    it('calcularPrecioOferta aplica el 20% de descuento', () => {
      expect(calcularPrecioOferta(10000)).toBe(8000);
    });

    it('calcularPrecioOferta redondea a peso entero', () => {
      expect(calcularPrecioOferta(10990)).toBe(8792);
    });

    it('obtenerPrecioFinal devuelve el precio con descuento si está en oferta', () => {
      const producto = obtenerProductoPorCodigo(lista, 'POL-002');
      expect(obtenerPrecioFinal(producto)).toBe(calcularPrecioOferta(producto.precio));
    });

    it('obtenerPrecioFinal devuelve el precio normal si no está en oferta', () => {
      const producto = obtenerProductoPorCodigo(lista, 'POL-001');
      expect(obtenerPrecioFinal(producto)).toBe(producto.precio);
    });

    it('obtenerProductosEnOferta devuelve un producto por cada código en oferta', () => {
      const enOferta = obtenerProductosEnOferta(lista);
      expect(enOferta.length).toBe(CODIGOS_EN_OFERTA.length);
      for (let i = 0; i < enOferta.length; i++) {
        expect(estaEnOferta(enOferta[i].codigo)).toBeTrue();
      }
    });
  });

  describe('conversión entre frontend y backend', () => {
    it('convertirDesdeBackend usa nombreProducto como nombre y conserva id, código e imagen', () => {
      const producto = convertirDesdeBackend(comoBackend(lista[0]));
      expect(producto).toEqual(lista[0]);
    });

    it('convertirParaBackend envía nombreProducto y convierte precio y stock a número', () => {
      const datos = convertirParaBackend({ ...lista[0], precio: '1000', stock: '3' });
      expect(datos.nombreProducto).toBe('Polera Oversize Negra');
      expect(datos.precio).toBe(1000);
      expect(datos.stock).toBe(3);
      expect(datos.id).toBeUndefined();
    });
  });

  describe('búsquedas sobre la lista cargada', () => {
    it('obtenerProductoPorCodigo encuentra un producto existente', () => {
      const producto = obtenerProductoPorCodigo(lista, 'CHA-001');
      expect(producto.nombre).toBe('Chaqueta Denim Negra');
    });

    it('obtenerProductoPorCodigo devuelve null si el código no existe', () => {
      expect(obtenerProductoPorCodigo(lista, 'XXX-999')).toBeNull();
    });

    it('obtenerProductosPorCategoria filtra por categoría', () => {
      const chaquetas = obtenerProductosPorCategoria(lista, 'Chaquetas');
      expect(chaquetas.length).toBe(2);
    });

    it('obtenerProductosPorCategoria devuelve arreglo vacío si no hay productos', () => {
      expect(obtenerProductosPorCategoria(lista, 'Sombreros')).toEqual([]);
    });

    it('sin texto ni categoría devuelve todos los productos', () => {
      expect(buscarProductos(lista, '', '').length).toBe(lista.length);
    });

    it('busca por texto del nombre sin importar mayúsculas', () => {
      const resultado = buscarProductos(lista, 'BOTAS', '');
      expect(resultado.length).toBe(1);
      expect(resultado[0].codigo).toBe('CAL-001');
    });

    it('busca por código', () => {
      expect(buscarProductos(lista, 'pan-002', '')[0].nombre).toBe('Cargo Pants Negro');
    });

    it('filtra por categoría', () => {
      expect(buscarProductos(lista, '', 'Calzado').length).toBe(2);
    });

    it('combina texto y categoría', () => {
      expect(buscarProductos(lista, 'jeans', 'Pantalones').length).toBe(2);
    });

    it('devuelve arreglo vacío si nada coincide', () => {
      expect(buscarProductos(lista, 'zzzz', '')).toEqual([]);
    });

    it('ignora espacios al inicio y al final del texto', () => {
      expect(buscarProductos(lista, '   botas  ', '').length).toBe(1);
    });

    it('acepta texto nulo como búsqueda vacía', () => {
      expect(buscarProductos(lista, null, '').length).toBe(lista.length);
    });
  });

  describe('llamadas al backend (fetch simulado)', () => {
    it('listarProductos hace GET /productos y convierte cada producto', async () => {
      simularApi([{ ruta: '/productos', datos: listaComoBackend() }]);
      const productos = await listarProductos();
      expect(productos.length).toBe(11);
      expect(productos[0].nombre).toBe('Polera Oversize Negra');
    });

    it('obtenerProductoPorId hace GET /productos/{id}', async () => {
      simularApi([{ ruta: '/productos/8', datos: comoBackend(lista[7]) }]);
      const producto = await obtenerProductoPorId(8);
      expect(producto.codigo).toBe('CHA-001');
    });

    it('crearProducto hace POST con los nombres de campo del backend', async () => {
      const espia = simularApi([{ ruta: '/productos', metodo: 'POST', datos: comoBackend(lista[0]) }]);
      await crearProducto(lista[0]);
      const cuerpo = cuerpoEnviado(espia, 0);
      expect(cuerpo.nombreProducto).toBe('Polera Oversize Negra');
      expect(cuerpo.codigo).toBe('POL-001');
    });

    it('actualizarProducto hace PUT /productos/{id}', async () => {
      const espia = simularApi([{ ruta: '/productos/1', metodo: 'PUT', datos: comoBackend(lista[0]) }]);
      const producto = await actualizarProducto(1, lista[0]);
      expect(producto.id).toBe(1);
      expect(espia.calls.argsFor(0)[1].method).toBe('PUT');
    });

    it('eliminarProducto hace DELETE /productos/{id}', async () => {
      const espia = simularApi([{ ruta: '/productos/3', metodo: 'DELETE', status: 204, datos: null }]);
      await eliminarProducto(3);
      expect(espia).toHaveBeenCalledTimes(1);
    });

    it('descontarStock hace PUT /productos/{id}/descontar/{cantidad}', async () => {
      simularApi([{ ruta: '/productos/1/descontar/2', metodo: 'PUT', datos: { ...comoBackend(lista[0]), stock: 6 } }]);
      const producto = await descontarStock(1, 2);
      expect(producto.stock).toBe(6);
    });

    it('si el backend rechaza el descuento de stock, propaga el mensaje', async () => {
      simularApi([{ ruta: '/productos/8/descontar/5', metodo: 'PUT', status: 400, datos: { error: 'Stock insuficiente' } }]);
      await expectAsync(descontarStock(8, 5)).toBeRejectedWithError('Stock insuficiente');
    });
  });
});
