import { useState } from 'react';
import { useProductos } from '../context/ProductosContext';
import {
  formatearPrecio,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from '../data/productos';
import { obtenerCategorias } from '../data/categorias';

const FORMULARIO_VACIO = {
  codigo: '',
  nombre: '',
  descripcion: '',
  precio: '',
  stock: '',
  categoria: '',
  talla: '',
  imagen: '',
};

function AdminProductos({ esAdmin }) {
  const { productos, cargando, error, recargarProductos } = useProductos();
  const categorias = obtenerCategorias();

  const [detalle, setDetalle] = useState(null);
  const [form, setForm] = useState(FORMULARIO_VACIO);
  const [idEditando, setIdEditando] = useState(null);
  const [idAEliminar, setIdAEliminar] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [errorAccion, setErrorAccion] = useState('');

  async function verDetalle(id) {
    setErrorAccion('');
    try {
      const producto = await obtenerProductoPorId(id);
      setDetalle(producto);
    } catch (e) {
      setErrorAccion(e.message);
    }
  }

  function manejarCambio(evento) {
    setForm({ ...form, [evento.target.name]: evento.target.value });
  }

  function editar(producto) {
    setIdEditando(producto.id);
    setForm({
      codigo: producto.codigo || '',
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: String(producto.precio),
      stock: String(producto.stock),
      categoria: producto.categoria,
      talla: producto.talla,
      imagen: producto.imagen || '',
    });
    setMensaje('');
    setErrorAccion('');
  }

  function cancelarEdicion() {
    setIdEditando(null);
    setForm(FORMULARIO_VACIO);
  }

  async function guardar(evento) {
    evento.preventDefault();
    setMensaje('');
    setErrorAccion('');
    try {
      if (idEditando === null) {
        await crearProducto(form);
        setMensaje('Producto creado correctamente.');
      } else {
        await actualizarProducto(idEditando, form);
        setMensaje('Producto actualizado correctamente.');
      }
      cancelarEdicion();
      await recargarProductos();
    } catch (e) {
      setErrorAccion(e.message);
    }
  }

  async function confirmarEliminar() {
    const id = idAEliminar;
    setIdAEliminar(null);
    setMensaje('');
    setErrorAccion('');
    try {
      await eliminarProducto(id);
      setMensaje('Producto eliminado.');
      if (detalle !== null && detalle.id === id) {
        setDetalle(null);
      }
      await recargarProductos();
    } catch (e) {
      setErrorAccion(e.message);
    }
  }

  return (
    <div>
      {error && <p className="mensaje-error">{error}</p>}
      {errorAccion && <p className="mensaje-error">{errorAccion}</p>}
      {mensaje && <p style={{ color: '#3a7d44' }}>{mensaje}</p>}

      {esAdmin && (
        <div className="form-contenedor mb-4">
          <h4 className="mb-3">{idEditando === null ? 'Nuevo producto' : 'Editar producto'}</h4>
          <form onSubmit={guardar}>
            <div className="row">
              <div className="col-md-3 form-grupo mb-3">
                <label htmlFor="p-codigo" className="form-label">Código</label>
                <input className="form-control" id="p-codigo" name="codigo" value={form.codigo} onChange={manejarCambio} required />
              </div>
              <div className="col-md-5 form-grupo mb-3">
                <label htmlFor="p-nombre" className="form-label">Nombre</label>
                <input className="form-control" id="p-nombre" name="nombre" value={form.nombre} onChange={manejarCambio} required />
              </div>
              <div className="col-md-4 form-grupo mb-3">
                <label htmlFor="p-categoria" className="form-label">Categoría</label>
                <select className="form-select" id="p-categoria" name="categoria" value={form.categoria} onChange={manejarCambio} required>
                  <option value="" disabled>Selecciona una categoría</option>
                  {categorias.map((c) => (
                    <option key={c.nombre} value={c.nombre}>{c.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-12 form-grupo mb-3">
                <label htmlFor="p-descripcion" className="form-label">Descripción</label>
                <input className="form-control" id="p-descripcion" name="descripcion" value={form.descripcion} onChange={manejarCambio} required />
              </div>
              <div className="col-md-3 form-grupo mb-3">
                <label htmlFor="p-precio" className="form-label">Precio</label>
                <input type="number" min="0" className="form-control" id="p-precio" name="precio" value={form.precio} onChange={manejarCambio} required />
              </div>
              <div className="col-md-3 form-grupo mb-3">
                <label htmlFor="p-stock" className="form-label">Stock</label>
                <input type="number" min="0" className="form-control" id="p-stock" name="stock" value={form.stock} onChange={manejarCambio} required />
              </div>
              <div className="col-md-2 form-grupo mb-3">
                <label htmlFor="p-talla" className="form-label">Talla</label>
                <input className="form-control" id="p-talla" name="talla" value={form.talla} onChange={manejarCambio} required />
              </div>
              <div className="col-md-4 form-grupo mb-3">
                <label htmlFor="p-imagen" className="form-label">Imagen (ruta)</label>
                <input className="form-control" id="p-imagen" name="imagen" placeholder="/img/productos/..." value={form.imagen} onChange={manejarCambio} />
              </div>
            </div>
            <div className="text-end">
              {idEditando !== null && (
                <button type="button" className="btn btn-secundario me-2" onClick={cancelarEdicion}>Cancelar</button>
              )}
              <button type="submit" className="btn btn-primario">
                {idEditando === null ? 'Crear producto' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </div>
      )}

      {detalle !== null && (
        <div className="form-contenedor mb-4">
          <div className="d-flex justify-content-between align-items-start">
            <h4 className="mb-3">Detalle del producto</h4>
            <button type="button" className="btn btn-secundario btn-sm py-0" onClick={() => setDetalle(null)}>Cerrar</button>
          </div>
          <div className="row g-3">
            <div className="col-md-3">
              {detalle.imagen && <img src={detalle.imagen} className="img-fluid" alt={detalle.nombre} />}
            </div>
            <div className="col-md-9">
              <h5>{detalle.nombre}</h5>
              <p className="mb-2">{detalle.descripcion}</p>
              <ul className="atributo">
                <li>ID: {detalle.id}</li>
                <li>Código: {detalle.codigo}</li>
                <li>Categoría: {detalle.categoria}</li>
                <li>Talla: {detalle.talla}</li>
                <li>Precio: {formatearPrecio(detalle.precio)}</li>
                <li>Stock: {detalle.stock}</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {cargando ? (
        <p className="atributo">Cargando productos...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id} className="fila-producto-admin">
                  <td>{producto.codigo}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.categoria}</td>
                  <td>{formatearPrecio(producto.precio)}</td>
                  <td>{producto.stock}</td>
                  <td>
                    <button type="button" className="btn btn-secundario btn-sm py-0 me-1" onClick={() => verDetalle(producto.id)}>Ver</button>
                    {esAdmin && (
                      <>
                        <button type="button" className="btn btn-secundario btn-sm py-0 me-1" onClick={() => editar(producto)}>Editar</button>
                        <button type="button" className="btn btn-primario btn-sm py-0" onClick={() => setIdAEliminar(producto.id)}>Eliminar</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {idAEliminar !== null && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirmar eliminación</h5>
                  <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setIdAEliminar(null)}></button>
                </div>
                <div className="modal-body">¿Seguro que quieres eliminar este producto del catálogo?</div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secundario" onClick={() => setIdAEliminar(null)}>Cancelar</button>
                  <button type="button" className="btn btn-primario" onClick={confirmarEliminar}>Sí, eliminar</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}

export default AdminProductos;
