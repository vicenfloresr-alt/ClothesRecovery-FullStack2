import { useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerProductos, formatearPrecio } from '../data/productos';
import ProductoCard from '../components/ProductoCard';
import { useCarrito } from '../context/CarritoContext';

// Misma estructura que carrito.html del sitio base: a la izquierda la
// lista de productos con botón de añadir, a la derecha la tabla del
// carrito (imagen, nombre, precio, cantidad con - y +, subtotal, eliminar),
// el total y los botones "Limpiar" y "Comprar ahora". Eliminar pide
// confirmación con un modal, igual que la plantilla.
function Carrito() {
  const {
    items,
    agregarAlCarrito,
    cambiarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    stockDe,
    totalPrecio,
  } = useCarrito();

  // Código del producto que se está por eliminar (null = modal cerrado)
  const [codigoAEliminar, setCodigoAEliminar] = useState(null);

  const productos = obtenerProductos();

  function confirmarEliminar() {
    eliminarDelCarrito(codigoAEliminar);
    setCodigoAEliminar(null);
  }

  return (
    <main>
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            {/* Lista de productos */}
            <div className="col-lg-6">
              <h2 className="mb-4">Lista de productos</h2>
              <div className="row g-3">
                {productos.map((producto) => (
                  <ProductoCard
                    key={producto.codigo}
                    producto={producto}
                    onAgregar={agregarAlCarrito}
                    claseColumna="col-6 col-md-4 col-lg-6 col-xl-4"
                  />
                ))}
              </div>
            </div>

            {/* Carrito de compras */}
            <div className="col-lg-6">
              <h2 className="mb-4">Carrito de Compras</h2>

              {items.length === 0 ? (
                <div className="mensaje-estado">
                  <p className="mb-0">Tu carrito está vacío. Añade productos de la lista.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped align-middle">
                    <thead>
                      <tr>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.codigo} className="fila-carrito">
                          <td><img src={item.imagen} alt={item.nombre} /></td>
                          <td>{item.nombre}</td>
                          <td>{formatearPrecio(item.precio)}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <button
                                type="button"
                                className="btn btn-secundario btn-sm px-2 py-0"
                                onClick={() => cambiarCantidad(item.codigo, item.cantidad - 1)}
                                disabled={item.cantidad <= 1}
                              >
                                -
                              </button>
                              <span className="mx-2">{item.cantidad}</span>
                              <button
                                type="button"
                                className="btn btn-secundario btn-sm px-2 py-0"
                                onClick={() => cambiarCantidad(item.codigo, item.cantidad + 1)}
                                disabled={item.cantidad >= stockDe(item.codigo)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td>{formatearPrecio(item.precio * item.cantidad)}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-secundario btn-sm py-0"
                              onClick={() => setCodigoAEliminar(item.codigo)}
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan="4" className="text-end fw-bold">Total</td>
                        <td colSpan="2" className="fw-bold precio">{formatearPrecio(totalPrecio)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              <div className="text-end">
                <button
                  type="button"
                  className="btn btn-secundario me-2"
                  onClick={vaciarCarrito}
                  disabled={items.length === 0}
                >
                  Limpiar
                </button>
                {items.length === 0 ? (
                  <button type="button" className="btn btn-primario" disabled>Comprar ahora</button>
                ) : (
                  <Link to="/comprar" className="btn btn-primario">Comprar ahora</Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de confirmación para eliminar un producto */}
      {codigoAEliminar !== null && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirmar Eliminación</h5>
                  <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setCodigoAEliminar(null)}></button>
                </div>
                <div className="modal-body">
                  ¿Estás seguro de que deseas eliminar este producto del carrito?
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secundario" onClick={() => setCodigoAEliminar(null)}>Cancelar</button>
                  <button type="button" className="btn btn-primario" onClick={confirmarEliminar}>Eliminar</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </main>
  );
}

export default Carrito;
