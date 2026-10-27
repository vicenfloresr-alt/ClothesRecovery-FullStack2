import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatearPrecio, estaEnOferta, obtenerPrecioFinal } from '../data/productos';

// Misma estructura de tarjeta que trae el sitio base (card + card-producto
// + card-img-top + card-body), con nuestros productos y colores reales.
// Recibe el producto como prop y una función "onAgregar" (así el padre
// decide qué pasa al añadir, el componente solo avisa el clic).
// Si el producto está en oferta, muestra el precio anterior tachado y el
// precio nuevo, igual que las tarjetas de ofertas.html del sitio base.
// "claseColumna" permite cambiar el ancho de la tarjeta según dónde se use
// (por defecto 4 por fila en pantallas grandes).
function ProductoCard({ producto, onAgregar, claseColumna = 'col-md-6 col-lg-3' }) {
  const [sinStock, setSinStock] = useState(false);

  const enOferta = estaEnOferta(producto.codigo);
  const precioFinal = obtenerPrecioFinal(producto);

  function manejarClic() {
    // Le pasamos al carrito el producto con el precio que realmente se cobra
    const seAgrego = onAgregar({
      codigo: producto.codigo,
      nombre: producto.nombre,
      precio: precioFinal,
      imagen: producto.imagen,
    });
    setSinStock(seAgrego === false);
  }

  return (
    <div className={claseColumna}>
      <div className="card card-producto tarjeta-producto h-100 position-relative">
        {enOferta && <span className="badge-oferta">Oferta</span>}
        <Link to={`/productos/${producto.codigo}`}>
          <img src={producto.imagen} className="card-img-top" alt={producto.nombre} />
        </Link>
        <div className="card-body d-flex flex-column">
          <Link to={`/productos/${producto.codigo}`} className="link-none">
            <h3 className="card-title">{producto.nombre}</h3>
          </Link>
          <div className="d-flex flex-column mb-2">
            {enOferta && (
              <span className="precio-descuento text-decoration-line-through">{formatearPrecio(producto.precio)}</span>
            )}
            <span className="precio precio-nuevo fw-bolder">{formatearPrecio(precioFinal)}</span>
          </div>
          <small className="atributo mb-2">Stock disponible: {producto.stock}</small>
          <button
            type="button"
            className="btn btn-primario w-100 mt-auto"
            onClick={manejarClic}
            disabled={producto.stock < 1}
          >
            {producto.stock < 1 ? 'Sin stock' : 'Añadir al carrito'}
          </button>
          {sinStock && <small className="mensaje-error mt-2">Ya tienes todo el stock en tu carrito.</small>}
        </div>
      </div>
    </div>
  );
}

export default ProductoCard;
