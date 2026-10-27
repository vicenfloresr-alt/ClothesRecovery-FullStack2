import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatearPrecio, descontarStock } from '../data/productos';
import { agregarPedido, procesarPago } from '../data/pedidos';
import DireccionFields from '../components/DireccionFields';
import { useCarrito } from '../context/CarritoContext';
import { useSesion } from '../context/SesionContext';

function formularioInicial(usuario) {
  if (usuario === null) {
    return {
      nombre: '', apellidos: '', correo: '',
      calle: '', departamento: '', region: '', comuna: '', indicaciones: '',
    };
  }
  const direccion = usuario.direccion || {};
  return {
    nombre: usuario.nombre,
    apellidos: usuario.apellidos,
    correo: usuario.correo,
    calle: direccion.calle || '',
    departamento: direccion.departamento || '',
    region: direccion.region ? String(direccion.region) : '',
    comuna: direccion.comuna ? String(direccion.comuna) : '',
    indicaciones: direccion.indicaciones || '',
  };
}

function Comprar() {
  const { items, totalPrecio, vaciarCarrito, stockDe } = useCarrito();
  const navigate = useNavigate();
  const { usuario } = useSesion();

  const [form, setForm] = useState(() => formularioInicial(usuario));

  function cambiarCampo(nombre, valor) {
    setForm((anterior) => ({ ...anterior, [nombre]: valor }));
  }

  function manejarCambio(evento) {
    cambiarCampo(evento.target.name, evento.target.value);
  }

  function hayProblemaDeStock() {
    for (let i = 0; i < items.length; i++) {
      if (items[i].cantidad > stockDe(items[i].codigo)) {
        return true;
      }
    }
    return false;
  }

  function manejarPago(evento) {
    evento.preventDefault();

    const pagoAceptado = !hayProblemaDeStock() && procesarPago(totalPrecio);

    const pedido = agregarPedido({
      estado: pagoAceptado ? 'pagado' : 'rechazado',
      cliente: {
        nombre: form.nombre,
        apellidos: form.apellidos,
        correo: form.correo,
      },
      direccion: {
        calle: form.calle,
        departamento: form.departamento,
        region: Number(form.region),
        comuna: Number(form.comuna),
        indicaciones: form.indicaciones,
      },
      items: items,
      total: totalPrecio,
    });

    if (pagoAceptado) {
      for (let i = 0; i < items.length; i++) {
        descontarStock(items[i].codigo, items[i].cantidad);
      }
      vaciarCarrito();
      navigate(`/comprar/ok/${pedido.numero}`);
    } else {
      navigate(`/comprar/error/${pedido.numero}`);
    }
  }

  if (items.length === 0) {
    return (
      <main>
        <section className="container py-5 text-center">
          <h1>Tu carrito está vacío</h1>
          <p className="atributo">Añade productos antes de continuar con la compra.</p>
          <Link to="/productos" className="btn btn-primario">Ver productos</Link>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="form-contenedor">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                <div>
                  <h4 className="mb-1">Carrito de compra</h4>
                  <p className="form-subtitulo mb-0">Completa la siguiente información</p>
                </div>
                <p className="btn btn-primario py-3 mb-0">
                  Total a pagar: <strong>{formatearPrecio(totalPrecio)}</strong>
                </p>
              </div>

              <div className="table-responsive mt-3 mb-4">
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
                    {items.map((item) => (
                      <tr key={item.codigo} className="fila-carrito">
                        <td><img src={item.imagen} alt={item.nombre} /></td>
                        <td>{item.nombre}</td>
                        <td>{formatearPrecio(item.precio)}</td>
                        <td>{item.cantidad}</td>
                        <td>{formatearPrecio(item.precio * item.cantidad)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <form onSubmit={manejarPago}>
                <h4 className="mb-1">Información del cliente</h4>
                <p className="form-subtitulo">
                  {usuario === null
                    ? 'Completa la siguiente información'
                    : 'Completamos tus datos con tu sesión iniciada. Puedes cambiarlos antes de pagar.'}
                </p>
                <div className="row">
                  <div className="col-md-6 form-grupo mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre <span className="opcional">obligatorio</span></label>
                    <input type="text" className="form-control" id="nombre" name="nombre" value={form.nombre} onChange={manejarCambio} required />
                  </div>
                  <div className="col-md-6 form-grupo mb-3">
                    <label htmlFor="apellidos" className="form-label">Apellidos <span className="opcional">obligatorio</span></label>
                    <input type="text" className="form-control" id="apellidos" name="apellidos" value={form.apellidos} onChange={manejarCambio} required />
                  </div>
                  <div className="col-md-6 form-grupo mb-3">
                    <label htmlFor="correo" className="form-label">Correo <span className="opcional">obligatorio</span></label>
                    <input type="email" className="form-control" id="correo" name="correo" value={form.correo} onChange={manejarCambio} required />
                  </div>
                </div>

                <h4 className="mb-1">Dirección de entrega de los productos</h4>
                <p className="form-subtitulo">Ingresa tu dirección de forma detallada</p>
                <DireccionFields valores={form} onCambiar={cambiarCampo} />

                <div className="text-end">
                  <button type="submit" className="btn btn-primario btn-lg">
                    Pagar ahora <strong>{formatearPrecio(totalPrecio)}</strong>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Comprar;
