import { useSearchParams } from 'react-router-dom';
import { buscarProductos } from '../data/productos';
import { obtenerCategorias } from '../data/categorias';
import ProductoCard from '../components/ProductoCard';
import { useCarrito } from '../context/CarritoContext';

// Lista de productos con filtros. El texto buscado y la categoría viven en
// la URL (/productos?q=polera&categoria=Poleras), así el buscador del
// Navbar y los filtros de esta página usan la misma información y el
// resultado se puede compartir o recargar sin perder el filtro.
function Productos() {
  const { agregarAlCarrito } = useCarrito();
  const [parametros, setParametros] = useSearchParams();
  const categorias = obtenerCategorias();

  const texto = parametros.get('q') || '';
  const categoria = parametros.get('categoria') || '';
  const productos = buscarProductos(texto, categoria);

  // Cambia un filtro en la URL (si queda vacío, se quita de la URL)
  function cambiarFiltro(nombre, valor) {
    const nuevos = new URLSearchParams(parametros);
    if (valor === '') {
      nuevos.delete(nombre);
    } else {
      nuevos.set(nombre, valor);
    }
    setParametros(nuevos);
  }

  return (
    <main>
      <section className="container py-5">
        <h1 className="text-center mb-4">Productos</h1>

        <div className="row g-3 mb-4 form-grupo">
          <div className="col-md-6">
            <label htmlFor="filtro-texto" className="form-label">Buscar</label>
            <input
              type="search"
              className="form-control"
              id="filtro-texto"
              placeholder="Nombre, descripción o código"
              value={texto}
              onChange={(e) => cambiarFiltro('q', e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="filtro-categoria" className="form-label">Categoría</label>
            <select
              className="form-select"
              id="filtro-categoria"
              value={categoria}
              onChange={(e) => cambiarFiltro('categoria', e.target.value)}
            >
              <option value="">Todas</option>
              {categorias.map((c) => (
                <option key={c.nombre} value={c.nombre}>{c.nombre}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button type="button" className="btn btn-secundario w-100" onClick={() => setParametros({})}>
              Limpiar
            </button>
          </div>
        </div>

        <p className="atributo">
          {productos.length === 1 ? '1 producto encontrado' : productos.length + ' productos encontrados'}
        </p>

        {productos.length === 0 ? (
          <p className="text-center mensaje-estado">No encontramos productos con esos filtros.</p>
        ) : (
          <div className="row g-4">
            {productos.map((producto) => (
              <ProductoCard key={producto.codigo} producto={producto} onAgregar={agregarAlCarrito} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Productos;
