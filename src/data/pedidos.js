// "Base de datos" simulada de pedidos (las compras que se hacen en la tienda).
// Cada vez que se intenta pagar se guarda un pedido, con estado 'pagado'
// o 'rechazado'. Las páginas "Compra exitosa" y "Compra con error" leen el
// pedido por su número. Se guarda también en localStorage para que la
// página de resultado siga funcionando si se recarga el navegador.

const CLAVE_STORAGE = 'pedidos-clothesrecovery';

// Monto máximo que acepta la pasarela de pago simulada. Sobre este monto el
// "banco" rechaza el pago (así se puede mostrar el flujo de pago con error).
export const LIMITE_PAGO = 150000;

function leerPedidosGuardados() {
  try {
    const texto = localStorage.getItem(CLAVE_STORAGE);
    if (texto !== null) {
      return JSON.parse(texto);
    }
  } catch (error) {
    // si localStorage no está disponible, partimos sin pedidos
  }
  return [];
}

function guardarPedidos() {
  try {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(pedidos));
  } catch (error) {
    // si no se puede guardar, igual funciona mientras no se recargue
  }
}

let pedidos = leerPedidosGuardados();

// Simula la pasarela de pago: acepta el pago si el monto no supera el límite
export function procesarPago(total) {
  return total <= LIMITE_PAGO;
}

// ---------- CRUD ----------

// Leer todos
export function obtenerPedidos() {
  return pedidos;
}

// Leer uno por número
export function obtenerPedidoPorNumero(numero) {
  for (let i = 0; i < pedidos.length; i++) {
    if (String(pedidos[i].numero) === String(numero)) {
      return pedidos[i];
    }
  }
  return null;
}

// Crear: arma el pedido con número y código de orden nuevos, y lo guarda.
// Devuelve el pedido creado.
export function agregarPedido(datos) {
  const numero = 20260000 + pedidos.length + 1;

  // Copiamos los items para que el pedido no cambie si el carrito cambia después
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

// Actualizar
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

// Eliminar
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
