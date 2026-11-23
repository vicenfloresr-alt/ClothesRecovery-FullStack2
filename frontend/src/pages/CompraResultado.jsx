import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { formatearPrecio } from '../data/productos';
import { obtenerPedidoPorNumero, LIMITE_PAGO } from '../data/pedidos';
import { obtenerNombreRegion, obtenerNombreComuna } from '../data/zonas';

function CompraResultado({ exito }) {
  const { numero } = useParams();
  const pedido = obtenerPedidoPorNumero(numero);
  const [mensaje, setMensaje] = useState('');

  if (pedido === null) {
    return (
      <main>
        <section className="container py-5 text-center">
          <h1>Pedido no encontrado</h1>
          <Link to="/" className="volver-link">&larr; Volver al inicio</Link>
        </section>
      </main>
    );
  }

  let motivo = 'Uno de los productos ya no tiene stock suficiente.';
  if (pedido.total > LIMITE_PAGO) {
    motivo = `El monto supera el límite de ${formatearPrecio(LIMITE_PAGO)} para pagos en línea.`;
  }

  return (
    <main>
      <section className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className={'form-contenedor mensaje-resultado ' + (exito ? 'exito' : 'error')}>
              <div className="text-end">
                <small className="atributo">Código orden: {pedido.codigoOrden}</small>
              </div>

              <h3 className="mb-3">
                {exito ? (
                  <i className="bi bi-check-circle text-success"></i>
                ) : (
                  <i className="bi bi-x-circle" style={{ color: '#b3082f' }}></i>
                )}{' '}
                {exito
                  ? `Se ha realizado la compra. nro #${pedido.numero}`
                  : `No se pudo realizar el pago. nro #${pedido.numero}`}
              </h3>
              {!exito && <p className="mensaje-error mb-3" style={{ fontSize: '14px' }}>{motivo}</p>}

              <p className="form-subtitulo">{exito ? 'Datos de tu compra' : 'Detalle de la compra'}</p>

              <div className="form-grupo">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label" htmlFor="r-nombre">Nombre</label>
                    <input className="form-control" id="r-nombre" value={pedido.cliente.nombre} disabled readOnly />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label" htmlFor="r-apellidos">Apellidos</label>
                    <input className="form-control" id="r-apellidos" value={pedido.cliente.apellidos} disabled readOnly />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label" htmlFor="r-correo">Correo</label>
                    <input className="form-control" id="r-correo" value={pedido.cliente.correo} disabled readOnly />
                  </div>
                </div>

                <h5 className="mb-3">Dirección de entrega de los productos</h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label" htmlFor="r-calle">Calle</label>
                    <input className="form-control" id="r-calle" value={pedido.direccion.calle} disabled readOnly />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label" htmlFor="r-depto">Departamento</label>
                    <input className="form-control" id="r-depto" value={pedido.direccion.departamento} disabled readOnly />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label" htmlFor="r-region">Región</label>
                    <input className="form-control" id="r-region" value={obtenerNombreRegion(pedido.direccion.region)} disabled readOnly />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label" htmlFor="r-comuna">Comuna</label>
                    <input className="form-control" id="r-comuna" value={obtenerNombreComuna(pedido.direccion.comuna)} disabled readOnly />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="r-indicaciones">Indicaciones para la entrega</label>
                    <textarea className="form-control" id="r-indicaciones" rows="2" value={pedido.direccion.indicaciones} disabled readOnly></textarea>
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-hover table-sm align-middle">
                  <thead>
                    <tr>
                      <th>Imagen</th>
                      <th>Nombre</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedido.items.map((item) => (
                      <tr key={item.codigo} className="fila-carrito">
                        <td><img src={item.imagen} alt={item.nombre} /></td>
                        <td>{item.nombre}</td>
                        <td>{formatearPrecio(item.precio)}</td>
                        <td>{item.cantidad}</td>
                        <td>{formatearPrecio(item.precio * item.cantidad)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="4" className="text-end fw-bold">Total</td>
                      <td className="fw-bold precio">{formatearPrecio(pedido.total)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {mensaje && <p className="text-center" style={{ color: '#3a7d44' }}>{mensaje}</p>}

              <div className="text-center mt-3">
                {exito ? (
                  <>
                    <button type="button" className="btn btn-secundario me-2" onClick={() => window.print()}>
                      Imprimir boleta en PDF
                    </button>
                    <button
                      type="button"
                      className="btn btn-primario"
                      onClick={() => setMensaje(`Se ha enviado la boleta a ${pedido.cliente.correo}`)}
                    >
                      Enviar boleta por email
                    </button>
                  </>
                ) : (
                  <Link to="/comprar" className="btn btn-primario btn-lg">VOLVER A REALIZAR EL PAGO</Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default CompraResultado;
