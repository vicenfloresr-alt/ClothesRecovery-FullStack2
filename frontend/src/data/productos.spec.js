import {
  formatearPrecio,
  estaEnOferta,
  calcularPrecioOferta,
  obtenerPrecioFinal,
  obtenerProductos,
  obtenerProductoPorCodigo,
  obtenerProductosPorCategoria,
  obtenerProductosEnOferta,
  buscarProductos,
  agregarProducto,
  editarProducto,
  eliminarProducto,
  descontarStock,
  CODIGOS_EN_OFERTA,
  PORCENTAJE_DESCUENTO,
} from './productos';

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
      expect(calcularPrecioOferta(17990)).toBe(14392);
    });

    it('obtenerPrecioFinal devuelve el precio con descuento si está en oferta', () => {
      const producto = obtenerProductoPorCodigo('POL-002');
      expect(obtenerPrecioFinal(producto)).toBe(calcularPrecioOferta(producto.precio));
    });

    it('obtenerPrecioFinal devuelve el precio normal si no está en oferta', () => {
      const producto = obtenerProductoPorCodigo('POL-001');
      expect(obtenerPrecioFinal(producto)).toBe(producto.precio);
    });

    it('obtenerProductosEnOferta devuelve un producto por cada código en oferta', () => {
      const enOferta = obtenerProductosEnOferta();
      expect(enOferta.length).toBe(CODIGOS_EN_OFERTA.length);
      for (let i = 0; i < enOferta.length; i++) {
        expect(estaEnOferta(enOferta[i].codigo)).toBeTrue();
      }
    });
  });

  describe('leer (R)', () => {
    it('obtenerProductos trae los 11 productos iniciales', () => {
      expect(obtenerProductos().length).toBe(11);
    });

    it('obtenerProductoPorCodigo encuentra un producto existente', () => {
      const producto = obtenerProductoPorCodigo('CHA-001');
      expect(producto).not.toBeNull();
      expect(producto.nombre).toBe('Chaqueta Denim Negra');
    });

    it('obtenerProductoPorCodigo devuelve null si el código no existe', () => {
      expect(obtenerProductoPorCodigo('XXX-999')).toBeNull();
    });

    it('obtenerProductosPorCategoria filtra por categoría', () => {
      const poleras = obtenerProductosPorCategoria('Poleras');
      expect(poleras.length).toBe(4);
      for (let i = 0; i < poleras.length; i++) {
        expect(poleras[i].categoria).toBe('Poleras');
      }
    });

    it('obtenerProductosPorCategoria devuelve arreglo vacío si no hay productos', () => {
      expect(obtenerProductosPorCategoria('Sombreros')).toEqual([]);
    });
  });

  describe('crear, editar y eliminar (C, U, D)', () => {
    const nuevo = {
      codigo: 'TST-001',
      nombre: 'Producto de prueba',
      descripcion: 'Solo para el test',
      precio: 1000,
      categoria: 'Poleras',
      imagen: '/img/test.jpg',
      stock: 3,
    };

    afterEach(() => {
      eliminarProducto('TST-001');
    });

    it('agregarProducto suma un producto a la lista', () => {
      const antes = obtenerProductos().length;
      agregarProducto({ ...nuevo });
      expect(obtenerProductos().length).toBe(antes + 1);
      expect(obtenerProductoPorCodigo('TST-001')).not.toBeNull();
    });

    it('editarProducto cambia los campos indicados y devuelve true', () => {
      agregarProducto({ ...nuevo });
      const resultado = editarProducto('TST-001', { precio: 2500, nombre: 'Editado' });
      expect(resultado).toBeTrue();
      const producto = obtenerProductoPorCodigo('TST-001');
      expect(producto.precio).toBe(2500);
      expect(producto.nombre).toBe('Editado');
      expect(producto.categoria).toBe('Poleras');
    });

    it('editarProducto devuelve false si el código no existe', () => {
      expect(editarProducto('XXX-999', { precio: 1 })).toBeFalse();
    });

    it('eliminarProducto saca el producto de la lista', () => {
      agregarProducto({ ...nuevo });
      const antes = obtenerProductos().length;
      eliminarProducto('TST-001');
      expect(obtenerProductos().length).toBe(antes - 1);
      expect(obtenerProductoPorCodigo('TST-001')).toBeNull();
    });

    it('eliminarProducto con un código inexistente no cambia nada', () => {
      const antes = obtenerProductos().length;
      eliminarProducto('XXX-999');
      expect(obtenerProductos().length).toBe(antes);
    });
  });

  describe('descontarStock', () => {
    it('resta la cantidad comprada al stock', () => {
      const antes = obtenerProductoPorCodigo('POL-001').stock;
      descontarStock('POL-001', 2);
      expect(obtenerProductoPorCodigo('POL-001').stock).toBe(antes - 2);
      editarProducto('POL-001', { stock: antes });
    });

    it('no falla si el código no existe', () => {
      expect(() => descontarStock('XXX-999', 1)).not.toThrow();
    });
  });

  describe('buscarProductos (buscador y filtros)', () => {
    it('sin texto ni categoría devuelve todos los productos', () => {
      expect(buscarProductos('', '').length).toBe(obtenerProductos().length);
    });

    it('busca por texto del nombre sin importar mayúsculas', () => {
      const resultado = buscarProductos('POLERA', '');
      expect(resultado.length).toBeGreaterThan(0);
      for (let i = 0; i < resultado.length; i++) {
        expect(resultado[i].nombre.toLowerCase()).toContain('polera');
      }
    });

    it('busca por código', () => {
      const resultado = buscarProductos('cha-001', '');
      expect(resultado.length).toBe(1);
      expect(resultado[0].codigo).toBe('CHA-001');
    });

    it('filtra por categoría', () => {
      const resultado = buscarProductos('', 'Calzado');
      expect(resultado.length).toBe(2);
    });

    it('combina texto y categoría', () => {
      expect(buscarProductos('botas', 'Calzado').length).toBe(1);
      expect(buscarProductos('botas', 'Poleras').length).toBe(0);
    });

    it('devuelve arreglo vacío si nada coincide', () => {
      expect(buscarProductos('zzzzzz', '')).toEqual([]);
    });

    it('ignora espacios al inicio y al final del texto', () => {
      expect(buscarProductos('  botas  ', '').length).toBe(1);
    });
  });
});
