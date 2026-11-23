import {
  LIMITE_PAGO,
  procesarPago,
  obtenerPedidos,
  obtenerPedidoPorNumero,
  agregarPedido,
  editarPedido,
  eliminarPedido,
} from './pedidos';

describe('pedidos.js', () => {
  const datos = {
    estado: 'pagado',
    cliente: { nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@correo.cl' },
    direccion: { calle: 'Calle 1', departamento: '', region: 1000, comuna: 1001, indicaciones: '' },
    items: [
      { codigo: 'POL-001', nombre: 'Polera', precio: 8990, imagen: '/img/a.jpg', cantidad: 2 },
      { codigo: 'CAL-001', nombre: 'Botas', precio: 34990, imagen: '/img/b.jpg', cantidad: 1 },
    ],
    total: 52970,
  };

  let creado = null;

  afterEach(() => {
    if (creado !== null) {
      eliminarPedido(creado.numero);
      creado = null;
    }
  });

  describe('procesarPago (pasarela simulada)', () => {
    it('el límite de pago es $150.000', () => {
      expect(LIMITE_PAGO).toBe(150000);
    });

    it('acepta un monto bajo el límite', () => {
      expect(procesarPago(50000)).toBeTrue();
    });

    it('acepta un monto exactamente igual al límite', () => {
      expect(procesarPago(150000)).toBeTrue();
    });

    it('rechaza un monto sobre el límite', () => {
      expect(procesarPago(150001)).toBeFalse();
    });
  });

  describe('crear (C)', () => {
    it('agregarPedido asigna número y código de orden', () => {
      creado = agregarPedido(datos);
      expect(creado.numero).toBeGreaterThan(20260000);
      expect(creado.codigoOrden).toBe('ORDER' + creado.numero);
      expect(creado.estado).toBe('pagado');
      expect(creado.total).toBe(52970);
    });

    it('guarda una copia de los items (no la misma referencia)', () => {
      creado = agregarPedido(datos);
      expect(creado.items).not.toBe(datos.items);
      expect(creado.items.length).toBe(2);
      expect(creado.items[0].cantidad).toBe(2);
    });

    it('guarda el pedido en localStorage', () => {
      creado = agregarPedido(datos);
      const guardado = JSON.parse(localStorage.getItem('pedidos-clothesrecovery'));
      let encontrado = false;
      for (let i = 0; i < guardado.length; i++) {
        if (guardado[i].numero === creado.numero) {
          encontrado = true;
        }
      }
      expect(encontrado).toBeTrue();
    });
  });

  describe('leer (R)', () => {
    it('obtenerPedidoPorNumero encuentra el pedido (con número o texto)', () => {
      creado = agregarPedido(datos);
      expect(obtenerPedidoPorNumero(creado.numero)).not.toBeNull();
      expect(obtenerPedidoPorNumero(String(creado.numero))).not.toBeNull();
    });

    it('obtenerPedidoPorNumero devuelve null si no existe', () => {
      expect(obtenerPedidoPorNumero(1)).toBeNull();
    });

    it('obtenerPedidos incluye el pedido recién creado', () => {
      const antes = obtenerPedidos().length;
      creado = agregarPedido(datos);
      expect(obtenerPedidos().length).toBe(antes + 1);
    });
  });

  describe('editar y eliminar (U, D)', () => {
    it('editarPedido cambia el estado y devuelve true', () => {
      creado = agregarPedido(datos);
      expect(editarPedido(creado.numero, { estado: 'rechazado' })).toBeTrue();
      expect(obtenerPedidoPorNumero(creado.numero).estado).toBe('rechazado');
    });

    it('editarPedido devuelve false si el pedido no existe', () => {
      expect(editarPedido(1, { estado: 'x' })).toBeFalse();
    });

    it('eliminarPedido quita el pedido', () => {
      creado = agregarPedido(datos);
      eliminarPedido(creado.numero);
      expect(obtenerPedidoPorNumero(creado.numero)).toBeNull();
      creado = null;
    });
  });

  describe('con localStorage simulado (mock)', () => {
    it('agregarPedido llama a localStorage.setItem con la clave de pedidos', () => {
      const espia = spyOn(Storage.prototype, 'setItem').and.callThrough();
      creado = agregarPedido(datos);
      expect(espia).toHaveBeenCalledWith('pedidos-clothesrecovery', jasmine.any(String));
    });

    it('si localStorage falla (lleno o bloqueado), el pedido igual se crea en memoria', () => {
      spyOn(Storage.prototype, 'setItem').and.throwError('almacenamiento lleno');
      expect(() => {
        creado = agregarPedido(datos);
      }).not.toThrow();
      expect(obtenerPedidoPorNumero(creado.numero)).not.toBeNull();
    });
  });
});
