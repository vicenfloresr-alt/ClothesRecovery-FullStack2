import { obtenerProductosEnOferta, PORCENTAJE_DESCUENTO } from '../data/productos';
import ProductoCard from '../components/ProductoCard';
import { useCarrito } from '../context/CarritoContext';

// Misma estructura que ofertas.html del sitio base: un título y una grilla
// de tarjetas con el precio anterior tachado y el precio nuevo.
function Ofertas() {
  const { agregarAlCarrito } = useCarrito();
  const productos = obtenerProductosEnOferta();

  return (
    <main>
      <section className="py-5">
        <div className="container">
          <h2 className="mb-1">Las mejores OFERTAS de la semana</h2>
          <p className="atributo mb-4">{PORCENTAJE_DESCUENTO}% de descuento en prendas seleccionadas.</p>
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

export default Ofertas;
