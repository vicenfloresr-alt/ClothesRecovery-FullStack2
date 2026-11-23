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

export const CODIGOS_EN_OFERTA = ['POL-002', 'PAN-002', 'CHA-001', 'CAL-002'];

export const PORCENTAJE_DESCUENTO = 20;

export function formatearPrecio(numero) {
  return '$' + numero.toLocaleString('es-CL');
}

export function estaEnOferta(codigo) {
  return CODIGOS_EN_OFERTA.indexOf(codigo) !== -1;
}

export function calcularPrecioOferta(precio) {
  return Math.round(precio * (100 - PORCENTAJE_DESCUENTO) / 100);
}

export function obtenerPrecioFinal(producto) {
  if (estaEnOferta(producto.codigo)) {
    return calcularPrecioOferta(producto.precio);
  }
  return producto.precio;
}

export function obtenerProductos() {
  return productos;
}

export function obtenerProductoPorCodigo(codigo) {
  for (let i = 0; i < productos.length; i++) {
    if (productos[i].codigo === codigo) {
      return productos[i];
    }
  }
  return null;
}

export function obtenerProductosPorCategoria(categoria) {
  const resultado = [];
  for (let i = 0; i < productos.length; i++) {
    if (productos[i].categoria === categoria) {
      resultado.push(productos[i]);
    }
  }
  return resultado;
}

export function obtenerProductosEnOferta() {
  const resultado = [];
  for (let i = 0; i < productos.length; i++) {
    if (estaEnOferta(productos[i].codigo)) {
      resultado.push(productos[i]);
    }
  }
  return resultado;
}

export function buscarProductos(texto, categoria) {
  const buscado = (texto || '').trim().toLowerCase();
  const resultado = [];
  for (let i = 0; i < productos.length; i++) {
    const producto = productos[i];
    const coincideCategoria = !categoria || producto.categoria === categoria;
    const todoElTexto = (producto.nombre + ' ' + producto.descripcion + ' ' + producto.codigo).toLowerCase();
    const coincideTexto = buscado === '' || todoElTexto.indexOf(buscado) !== -1;
    if (coincideCategoria && coincideTexto) {
      resultado.push(producto);
    }
  }
  return resultado;
}

export function agregarProducto(nuevoProducto) {
  productos.push(nuevoProducto);
}

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

export function eliminarProducto(codigo) {
  const restantes = [];
  for (let i = 0; i < productos.length; i++) {
    if (productos[i].codigo !== codigo) {
      restantes.push(productos[i]);
    }
  }
  productos = restantes;
}

export function descontarStock(codigo, cantidad) {
  const producto = obtenerProductoPorCodigo(codigo);
  if (producto !== null) {
    producto.stock = producto.stock - cantidad;
  }
}
