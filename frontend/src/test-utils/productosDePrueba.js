export const PRODUCTOS_DE_PRUEBA = [
  { id: 1, codigo: 'POL-001', nombre: 'Polera Oversize Negra', descripcion: 'Algodón pesado, corte oversize.', precio: 8990, categoria: 'Poleras', talla: 'M', imagen: '/img/productos/polera1.jpg', stock: 8 },
  { id: 2, codigo: 'POL-002', nombre: 'Polera Gráfica Blackletter', descripcion: 'Estampado con tipografía gótica.', precio: 10990, categoria: 'Poleras', talla: 'M', imagen: '/img/productos/poleras2.jpg', stock: 5 },
  { id: 3, codigo: 'POL-003', nombre: 'Polera Manga Larga Ribbed', descripcion: 'Tejido acanalado, cuello alto.', precio: 11990, categoria: 'Poleras', talla: 'M', imagen: '/img/productos/polera3.webp', stock: 6 },
  { id: 4, codigo: 'POL-004', nombre: 'Polera Crop Denim', descripcion: 'Corte crop, mezcla denim.', precio: 9990, categoria: 'Poleras', talla: 'S', imagen: '/img/productos/polera6.jpg', stock: 4 },
  { id: 5, codigo: 'PAN-001', nombre: 'Jeans Slim Gótico', descripcion: 'Slim fit, negro desgastado.', precio: 15990, categoria: 'Pantalones', talla: '32', imagen: '/img/productos/pantalon1.webp', stock: 5 },
  { id: 6, codigo: 'PAN-002', nombre: 'Cargo Pants Negro', descripcion: 'Bolsillos laterales, cintura ajustable.', precio: 17990, categoria: 'Pantalones', talla: '32', imagen: '/img/productos/cargo1.webp', stock: 3 },
  { id: 7, codigo: 'PAN-004', nombre: 'Jeans Estampado Tattoo', descripcion: 'Estampado gráfico estilo tattoo old school.', precio: 16990, categoria: 'Pantalones', talla: '34', imagen: '/img/productos/edhardys.webp', stock: 4 },
  { id: 8, codigo: 'CHA-001', nombre: 'Chaqueta Denim Negra', descripcion: 'Denim rígido teñido negro.', precio: 24990, categoria: 'Chaquetas', talla: 'L', imagen: '/img/productos/chaqueta1.jpg', stock: 2 },
  { id: 9, codigo: 'CHA-002', nombre: 'Chaqueta Bomber Oversize', descripcion: 'Forro acolchado, corte oversize.', precio: 27990, categoria: 'Chaquetas', talla: 'L', imagen: '/img/productos/chaqueta2.jpg', stock: 3 },
  { id: 10, codigo: 'CAL-001', nombre: 'Botas Combat Negras', descripcion: 'Suela de goma, 8 hoyos.', precio: 34990, categoria: 'Calzado', talla: '42', imagen: '/img/productos/calzado1.jpg', stock: 4 },
  { id: 11, codigo: 'CAL-002', nombre: 'Zapatillas Plataforma', descripcion: 'Plataforma 4cm, cordones anchos.', precio: 29990, categoria: 'Calzado', talla: '40', imagen: '/img/productos/calzado2.webp', stock: 6 },
];

export function comoBackend(producto) {
  return {
    id: producto.id,
    codigo: producto.codigo,
    nombreProducto: producto.nombre,
    descripcion: producto.descripcion,
    precio: producto.precio,
    categoria: producto.categoria,
    talla: producto.talla,
    imagen: producto.imagen,
    stock: producto.stock,
  };
}

export function listaComoBackend() {
  const lista = [];
  for (let i = 0; i < PRODUCTOS_DE_PRUEBA.length; i++) {
    lista.push(comoBackend(PRODUCTOS_DE_PRUEBA[i]));
  }
  return lista;
}
