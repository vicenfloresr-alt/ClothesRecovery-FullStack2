import { obtenerProductos } from '../data/productos';
import { obtenerCategorias } from '../data/categorias';
import ProductoCard from '../components/ProductoCard';
import CategoriaCard from '../components/CategoriaCard';
import { useCarrito } from '../context/CarritoContext';

function Home() {
  const { agregarAlCarrito } = useCarrito();
  const categorias = obtenerCategorias();

  const todosLosProductos = obtenerProductos();
  const destacados = [];
  for (let i = 0; i < todosLosProductos.length && destacados.length < 8; i++) {
    destacados.push(todosLosProductos[i]);
  }

  return (
    <main>
      <div id="carouselHome" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselHome" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselHome" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselHome" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="/img/hero1.jpg" className="d-block w-100 carousel-imagen" alt="Streetwear gótico ClothesRecovery" />
            <div className="carousel-caption d-none d-md-block">
              <h5>Ropa que viste la oscuridad</h5>
              <p>Prendas underground restauradas, streetwear gótico sin filtros.</p>
            </div>
          </div>
          <div className="carousel-item">
            <img src="/img/productos/chaqueta1.jpg" className="d-block w-100 carousel-imagen" alt="Chaquetas ClothesRecovery" />
            <div className="carousel-caption d-none d-md-block">
              <h5>Nuevos ingresos</h5>
              <p>Chaquetas y prendas recién recuperadas, en buen estado.</p>
            </div>
          </div>
          <div className="carousel-item">
            <img src="/img/productos/calzado1.webp" className="d-block w-100 carousel-imagen" alt="Calzado ClothesRecovery" />
            <div className="carousel-caption d-none d-md-block">
              <h5>Moda circular</h5>
              <p>Segunda vida para prendas buenas, a precios justos.</p>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselHome" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselHome" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>

      <section className="container py-5">
        <h2 className="text-center mb-4">Categorías</h2>
        <div className="row g-4">
          {categorias.map((categoria) => (
            <CategoriaCard key={categoria.nombre} categoria={categoria} />
          ))}
        </div>
      </section>

      <section className="py-5" style={{ backgroundColor: '#0f0f11' }}>
        <div className="container">
          <h2 className="text-center mb-4">Destacados de la semana</h2>
          <div className="row g-4">
            {destacados.map((producto) => (
              <ProductoCard key={producto.codigo} producto={producto} onAgregar={agregarAlCarrito} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
