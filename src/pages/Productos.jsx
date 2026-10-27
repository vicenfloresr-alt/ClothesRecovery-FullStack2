import { obtenerProductos } from '../data/productos';
import ProductoCard from '../components/ProductoCard';
import { useCarrito } from '../context/CarritoContext';

function Productos() {
  const { agregarAlCarrito } = useCarrito();
  const productos = obtenerProductos();

  return (
    <main>
      <section className="container py-5">
        <h1 className="text-center mb-4">Productos</h1>
        <div className="row g-4">
          {productos.map((producto) => (
            <ProductoCard key={producto.codigo} producto={producto} onAgregar={agregarAlCarrito} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Productos;
