import { Link, useParams } from 'react-router-dom';
import { obtenerCategorias, obtenerCategoriaPorNombre } from '../data/categorias';
import { obtenerProductosPorCategoria } from '../data/productos';
import ProductoCard from '../components/ProductoCard';
import { useCarrito } from '../context/CarritoContext';

// Misma estructura que categorias.html del sitio base: una fila con las
// categorías (imagen + nombre, la seleccionada resaltada) y debajo el
// título de la categoría con su grilla de productos.
function Categorias() {
  const { nombre } = useParams();
  const { agregarAlCarrito } = useCarrito();
  const categorias = obtenerCategorias();
  const categoria = obtenerCategoriaPorNombre(nombre);

  if (categoria === null) {
    return (
      <main>
        <section className="container py-5 text-center">
          <h1>Categoría no encontrada</h1>
          <Link to="/" className="volver-link">&larr; Volver al inicio</Link>
        </section>
      </main>
    );
  }

  const productos = obtenerProductosPorCategoria(categoria.nombre);

  return (
    <main>
      {/* Fila de categorías */}
      <div className="container mt-5">
        <ul className="nav justify-content-center">
          {categorias.map((cat) => (
            <li className="nav-item mx-2 mb-3" key={cat.nombre}>
              <Link
                to={`/categorias/${cat.nombre}`}
                className={'nav-card p-3 d-block link-none' + (cat.nombre === categoria.nombre ? ' nav-card-activa' : '')}
              >
                <img src={cat.imagen} width="100" height="100" className="card-img-top" alt={cat.nombre} />
                <span className="d-block mt-2">{cat.nombre}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Productos de la categoría */}
      <section className="py-5">
        <div className="container">
          <h2 className="mb-4">{categoria.nombre}</h2>
          {productos.length === 0 && <p className="atributo">Aún no hay productos en esta categoría.</p>}
          <div className="row g-4">
            {productos.map((producto) => (
              <ProductoCard key={producto.codigo} producto={producto} onAgregar={agregarAlCarrito} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Categorias;
