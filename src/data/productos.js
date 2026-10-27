// Este archivo actúa como "base de datos" simulada de productos.
// Es el mismo arreglo que usábamos en productos.html en Parcial 1,
// ahora vive en un solo lugar y los componentes lo importan.
// Trae funciones CRUD (Crear, Leer, Actualizar, Eliminar) encima del arreglo,
// tal como pide el enunciado de Parcial 2.
// "stock" es la cantidad disponible (igual que en el sitio base): el
// carrito no deja agregar más unidades que el stock, y al pagar se descuenta.

let productos = [
  { codigo: 'POL-001', nombre: 'Polera Oversize Negra', descripcion: 'Algodón pesado, corte oversize.', precio: 8990, categoria: 'Poleras', imagen: '/img/productos/polera1.jpg', stock: 8 },
  { codigo: 'POL-002', nombre: 'Polera Gráfica Blackletter', descripcion: 'Estampado con tipografía gótica.', precio: 10990, categoria: 'Poleras', imagen: '/img/productos/poleras2.jpg', stock: 5 },
  { codigo: 'POL-003', nombre: 'Polera Manga Larga Ribbed', descripcion: 'Tejido acanalado, cuello alto.', precio: 11990, categoria: 'Poleras', imagen: '/img/productos/polera3.webp', stock: 6 },
  { codigo: 'POL-004', nombre: 'Polera Crop Denim', descripcion: 'Corte crop, mezcla denim.', precio: 9990, categoria: 'Poleras', imagen: '/img/productos/polera6.jpg', stock: 4 },

  { codigo: 'PAN-001', nombre: 'Jeans Slim Gótico', descripcion: 'Slim fit, negro desgastado.', precio: 15990, categoria: 'Pantalones', imagen: '/img/productos/pantalon1.webp', stock: 5 },
  { codigo: 'PAN-002', nombre: 'Cargo Pants Negro', descripcion: 'Bolsillos laterales, cintura ajustable.', precio: 17990, categoria: 'Pantalones', imagen: '/img/productos/cargo1.webp', stock: 3 },
  { codigo: 'PAN-004', nombre: 'Jeans Estampado Tattoo', descripcion: 'Estampado gráfico estilo tattoo old school.', precio: 16990, categoria: 'Pantalones', imagen: '/img/productos/edhardys.webp', stock: 4 },

  { codigo: 'CHA-001', nombre: 'Chaqueta Denim Negra', descripcion: 'Denim rígido teñido negro.', precio: 24990, categoria: 'Chaquetas', imagen: '/img/productos/chaqueta1.jpg', stock: 2 },
  { codigo: 'CHA-002', nombre: 'Chaqueta Bomber Oversize', descripcion: 'Forro acolchado, corte oversize.', precio: 27990, categoria: 'Chaquetas', imagen: '/img/productos/chaqueta2.jpg', stock: 3 },

  { codigo: 'CAL-001', nombre: 'Botas Combat Negras', descripcion: 'Suela de goma, 8 hoyos.', precio: 34990, categoria: 'Calzado', imagen: '/img/productos/calzado1.jpg', stock: 4 },
  { codigo: 'CAL-002', nombre: 'Zapatillas Plataforma', descripcion: 'Plataforma 4cm, cordones anchos.', precio: 29990, categoria: 'Calzado', imagen: '/img/productos/calzado2.webp', stock: 6 },
];

// Códigos que se muestran en la vista de Ofertas (simple: una lista fija por ahora)
export const CODIGOS_EN_OFERTA = ['POL-002', 'PAN-002', 'CHA-001', 'CAL-002'];

// Descuento que se aplica a los productos en oferta (en porcentaje)
export const PORCENTAJE_DESCUENTO = 20;

export function formatearPrecio(numero) {
  return '$' + numero.toLocaleString('es-CL');
}

// ---------- Ofertas ----------

// ¿Este código está en la lista de ofertas?
export function estaEnOferta(codigo) {
  return CODIGOS_EN_OFERTA.indexOf(codigo) !== -1;
}

// Precio con el descuento aplicado (redondeado a peso entero)
export function calcularPrecioOferta(precio) {
  return Math.round(precio * (100 - PORCENTAJE_DESCUENTO) / 100);
}

// Precio que realmente se cobra: el de oferta si corresponde, si no el normal
export function obtenerPrecioFinal(producto) {
  if (estaEnOferta(producto.codigo)) {
    return calcularPrecioOferta(producto.precio);
  }
  return producto.precio;
}

// ---------- CRUD ----------

// Leer todos
export function obtenerProductos() {
  return productos;
}

// Leer uno por código
export function obtenerProductoPorCodigo(codigo) {
  for (let i = 0; i < productos.length; i++) {
    if (productos[i].codigo === codigo) {
      return productos[i];
    }
  }
  return null;
}

// Leer por categoría
export function obtenerProductosPorCategoria(categoria) {
  const resultado = [];
  for (let i = 0; i < productos.length; i++) {
    if (productos[i].categoria === categoria) {
      resultado.push(productos[i]);
    }
  }
  return resultado;
}

// Leer los que están en oferta
export function obtenerProductosEnOferta() {
  const resultado = [];
  for (let i = 0; i < productos.length; i++) {
    if (estaEnOferta(productos[i].codigo)) {
      resultado.push(productos[i]);
    }
  }
  return resultado;
}

// Crear
export function agregarProducto(nuevoProducto) {
  productos.push(nuevoProducto);
}

// Actualizar
export function editarProducto(codigo, datosNuevos) {
  for (let i = 0; i < productos.length; i++) {
    if (productos[i].codigo === codigo) {
      for (const clave in datosNuevos) {
        productos[i][clave] = datosNuevos[clave];
      }
      return true;
    }
  }
  return false;
}

// Eliminar
export function eliminarProducto(codigo) {
  const restantes = [];
  for (let i = 0; i < productos.length; i++) {
    if (productos[i].codigo !== codigo) {
      restantes.push(productos[i]);
    }
  }
  productos = restantes;
}

// Descontar stock después de una compra exitosa
export function descontarStock(codigo, cantidad) {
  const producto = obtenerProductoPorCodigo(codigo);
  if (producto !== null) {
    producto.stock = producto.stock - cantidad;
  }
}
