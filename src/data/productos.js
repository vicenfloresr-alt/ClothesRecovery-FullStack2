import { pedirApi } from './api';

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

export function convertirDesdeBackend(datos) {
  return {
    id: datos.id,
    codigo: datos.codigo,
    nombre: datos.nombreProducto,
    descripcion: datos.descripcion,
    precio: datos.precio,
    categoria: datos.categoria,
    talla: datos.talla,
    imagen: datos.imagen,
    stock: datos.stock,
  };
}

export function convertirParaBackend(producto) {
  return {
    codigo: producto.codigo,
    nombreProducto: producto.nombre,
    descripcion: producto.descripcion,
    precio: Number(producto.precio),
    stock: Number(producto.stock),
    categoria: producto.categoria,
    talla: producto.talla,
    imagen: producto.imagen,
  };
}

export async function listarProductos() {
  const datos = await pedirApi('/productos');
  const lista = [];
  for (let i = 0; i < datos.length; i++) {
    lista.push(convertirDesdeBackend(datos[i]));
  }
  return lista;
}

export async function obtenerProductoPorId(id) {
  const datos = await pedirApi('/productos/' + id);
  return convertirDesdeBackend(datos);
}

export async function crearProducto(producto) {
  const datos = await pedirApi('/productos', { method: 'POST', body: convertirParaBackend(producto) });
  return convertirDesdeBackend(datos);
}

export async function actualizarProducto(id, producto) {
  const datos = await pedirApi('/productos/' + id, { method: 'PUT', body: convertirParaBackend(producto) });
  return convertirDesdeBackend(datos);
}

export async function eliminarProducto(id) {
  await pedirApi('/productos/' + id, { method: 'DELETE' });
}

export async function descontarStock(id, cantidad) {
  const datos = await pedirApi('/productos/' + id + '/descontar/' + cantidad, { method: 'PUT' });
  return convertirDesdeBackend(datos);
}

export function obtenerProductoPorCodigo(productos, codigo) {
  for (let i = 0; i < productos.length; i++) {
    if (productos[i].codigo === codigo) {
      return productos[i];
    }
  }
  return null;
}

export function obtenerProductosPorCategoria(productos, categoria) {
  const resultado = [];
  for (let i = 0; i < productos.length; i++) {
    if (productos[i].categoria === categoria) {
      resultado.push(productos[i]);
    }
  }
  return resultado;
}

export function obtenerProductosEnOferta(productos) {
  const resultado = [];
  for (let i = 0; i < productos.length; i++) {
    if (estaEnOferta(productos[i].codigo)) {
      resultado.push(productos[i]);
    }
  }
  return resultado;
}

export function buscarProductos(productos, texto, categoria) {
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
