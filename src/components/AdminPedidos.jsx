import { useState, useEffect } from 'react';
import { useProductos } from '../context/ProductosContext';
import { formatearPrecio } from '../data/productos';
import { listarPedidosApi, obtenerPedidoApi } from '../data/pedidos';

function AdminPedidos() {
  const { productos } = useProductos();
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [detalle, setDetalle] = useState(null);

  async function cargarPedidos() {
    try {
      const lista = await listarPedidosApi();
      setPedidos(lista);
      setError('');
    } catch (e) {
      setError(e.message);
    }
    setCargando(false);
  }

  useEffect(() => {
    cargarPedidos();
  }, []);

  function nombreDelProducto(id) {
    for (let i = 0; i < productos.length; i++) {
      if (productos[i].id === id) {
        return productos[i].nombre;
      }
    }
    return 'Producto #' + id;
  }

  async function verDetalle(id) {
    try {
      const pedido = await obtenerPedidoApi(id);
      setDetalle(pedido);
    } catch (e) {
      setError(e.message);
    }
  }

  if (cargando) {
    return <p className="atributo">Cargando pedidos...</p>;
  }

  return (
    <div>
      {error && <p className="mensaje-error">{error}</p>}

      {detalle !== null && (
        <div className="form-contenedor mb-4">
          <div className="d-flex justify-content-between align-items-start">
            <h4 className="mb-3">Detalle del pedido #{detalle.id}</h4>
            <button type="button" className="btn btn-secundario btn-sm py-0" onClick={() => setDetalle(null)}>Cerrar</button>
          </div>
          <ul className="atributo">
            <li>Cliente: #{detalle.clienteId}</li>
            <li>Producto: {nombreDelProducto(detalle.productoId)}</li>
            <li>Cantidad: {detalle.cantidad}</li>
            <li>Total: {formatearPrecio(detalle.total)}</li>
            <li>Estado: {detalle.estadoPedido}</li>
            <li>Fecha: {detalle.fechaPedido}</li>
          </ul>
        </div>
      )}

      {pedidos.length === 0 ? (
        <p className="mensaje-estado">Aún no hay pedidos registrados.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>N°</th>
                <th>Cliente</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id} className="fila-pedido-admin">
                  <td>{pedido.id}</td>
                  <td>#{pedido.clienteId}</td>
                  <td>{nombreDelProducto(pedido.productoId)}</td>
                  <td>{pedido.cantidad}</td>
                  <td>{formatearPrecio(pedido.total)}</td>
                  <td>{pedido.estadoPedido}</td>
                  <td>{pedido.fechaPedido}</td>
                  <td>
                    <button type="button" className="btn btn-secundario btn-sm py-0" onClick={() => verDetalle(pedido.id)}>Ver</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminPedidos;
