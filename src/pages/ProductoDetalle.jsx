import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  obtenerProductoPorCodigo,
  formatearPrecio,
  estaEnOferta,
  obtenerPrecioFinal,
} from '../data/productos';
import { useCarrito } from '../context/CarritoContext';

// Misma estructura que productos/producto1.html del sitio base: breadcrumb,
// tarjeta con la imagen a la izquierda y a la derecha nombre, precio (con
// el precio anterior tachado si está en oferta), descripción, lista de
// características y botón "Agregar al Carrito".
function ProductoDetalle() {
  const { codigo } = useParams();
  const { agregarAlCarrito } = useCarrito();
  const [sinStock, setSinStock] = useState(false);
  const [agregado, setAgregado] = useState(false);

  const producto = obtenerProductoPorCodigo(codigo);

  if (producto === null) {
    return (
      <main>
        <section className="container py-5 text-center">
          <h1>Producto no encontrado</h1>
          <Link to="/productos" className="volver-link">&larr; Volver a productos</Link>
        </section>
      </main>
    );
  }

  const enOferta = estaEnOferta(producto.codigo);
  const precioFinal = obtenerPrecioFinal(producto);

  function manejarAgregar() {
    const seAgrego = agregarAlCarrito({
      codigo: producto.codigo,
      nombre: producto.nombre,
      precio: precioFinal,
      imagen: producto.imagen,
    });
    setSinStock(seAgrego === false);
    setAgregado(seAgrego !== false);
  }

  return (
    <main>
      <section className="container my-5">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Volver</Link></li>
            <li className="breadcrumb-item"><Link to={`/categorias/${producto.categoria}`}>Categorías</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{producto.categoria}</li>
          </ol>
        </nav>

        <div className="form-contenedor">
          <div className="row g-4">
            <div className="col-md-6">
              <img src={producto.imagen} className="img-fluid blog-detalle-imagen" alt={producto.nombre} />
            </div>
            <div className="col-md-6">
              <h1 className="mb-3" style={{ fontSize: '30px' }}>{producto.nombre}</h1>

              <div className="d-flex flex-column mb-3">
                {enOferta && (
                  <span className="precio-descuento text-decoration-line-through">{formatearPrecio(producto.precio)}</span>
                )}
                <span className="precio precio-nuevo fw-bolder" style={{ fontSize: '24px' }}>{formatearPrecio(precioFinal)}</span>
              </div>

              <p className="mb-4">{producto.descripcion}</p>

              <ul className="mb-4 atributo">
                <li>Categoría: {producto.categoria}</li>
                <li>Código: {producto.codigo}</li>
                <li>Stock disponible: {producto.stock}</li>
              </ul>

              <div className="d-grid">
                <button
                  type="button"
                  className="btn btn-primario btn-lg"
                  onClick={manejarAgregar}
                  disabled={producto.stock < 1}
                >
                  {producto.stock < 1 ? 'Sin stock' : 'Agregar al Carrito'}
                </button>
              </div>
              {sinStock && <p className="mensaje-error mt-2">Ya tienes todo el stock en tu carrito.</p>}
              {agregado && (
                <p className="mt-2" style={{ color: '#3a7d44' }}>
                  Producto agregado. <Link to="/carrito" className="volver-link">Ver carrito</Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductoDetalle;
