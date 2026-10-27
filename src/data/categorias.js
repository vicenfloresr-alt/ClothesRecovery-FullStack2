// Igual que productos.js, pero para las 4 categorías de la tienda.
// Se usan en Home (tarjetas de categoría) y en el menú del Navbar.

const categorias = [
  { nombre: 'Poleras', imagen: '/img/productos/polera1.jpg', descripcion: 'Oversize, gráficas y manga larga.' },
  { nombre: 'Pantalones', imagen: '/img/productos/pantalon1.webp', descripcion: 'Jeans y cargo con actitud streetwear.' },
  { nombre: 'Chaquetas', imagen: '/img/productos/chaqueta1.jpg', descripcion: 'Denim y bomber oversize.' },
  { nombre: 'Calzado', imagen: '/img/productos/calzado1.jpg', descripcion: 'Botas combat y plataformas.' },
];

export function obtenerCategorias() {
  return categorias;
}

export function obtenerCategoriaPorNombre(nombre) {
  for (let i = 0; i < categorias.length; i++) {
    if (categorias[i].nombre === nombre) {
      return categorias[i];
    }
  }
  return null;
}
