const CLAVE_STORAGE = 'pedidos-clothesrecovery';

export const LIMITE_PAGO = 150000;

function leerPedidosGuardados() {
  try {
    const texto = localStorage.getItem(CLAVE_STORAGE);
    if (texto !== null) {
      return JSON.parse(texto);
    }
  } catch (error) {
  }
  return [];
}

function guardarPedidos() {
  try {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(pedidos));
  } catch (error) {
  }
}

let pedidos = leerPedidosGuardados();

export function procesarPago(total) {
  return total <= LIMITE_PAGO;
}

export function obtenerPedidos() {
  return pedidos;
}

export function obtenerPedidoPorNumero(numero) {
  for (let i = 0; i < pedidos.length; i++) {
    if (String(pedidos[i].numero) === String(numero)) {
      return pedidos[i];
    }
  }
  return null;
}

export function agregarPedido(datos) {
  const numero = 20260000 + pedidos.length + 1;

  const items = [];
  for (let i = 0; i < datos.items.length; i++) {
    items.push({
      codigo: datos.items[i].codigo,
      nombre: datos.items[i].nombre,
      precio: datos.items[i].precio,
      imagen: datos.items[i].imagen,
      cantidad: datos.items[i].cantidad,
    });
  }

  const pedido = {
    numero: numero,
    codigoOrden: 'ORDER' + numero,
    fecha: new Date().toISOString(),
    estado: datos.estado,
    cliente: datos.cliente,
    direccion: datos.direccion,
    items: items,
    total: datos.total,
  };

  pedidos.push(pedido);
  guardarPedidos();
  return pedido;
}

export function editarPedido(numero, datosNuevos) {
  for (let i = 0; i < pedidos.length; i++) {
    if (String(pedidos[i].numero) === String(numero)) {
      for (const clave in datosNuevos) {
        pedidos[i][clave] = datosNuevos[clave];
      }
      guardarPedidos();
      return true;
    }
  }
  return false;
}

export function eliminarPedido(numero) {
  const restantes = [];
  for (let i = 0; i < pedidos.length; i++) {
    if (String(pedidos[i].numero) !== String(numero)) {
      restantes.push(pedidos[i]);
    }
  }
  pedidos = restantes;
  guardarPedidos();
}
