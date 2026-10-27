import { Link } from 'react-router-dom';
import { obtenerBlogs } from '../data/blogs';

// Misma estructura que blog.html del sitio base: una grilla de tarjetas
// (card + card-img-top + botón "Explorar"), una por cada post, en vez de
// las categorías de videojuegos de la plantilla.
function Blogs() {
  const blogs = obtenerBlogs();

  return (
    <main>
      <section className="container py-5">
        <h1 className="text-center mb-4">Blogs</h1>
        <div className="row g-4">
          {blogs.map((blog) => (
            <div className="col-md-4" key={blog.slug}>
              <div className="card h-100" style={{ backgroundColor: '#16161a', border: '1px solid #2a2a2e' }}>
                <img src={blog.imagen} className="card-img-top" alt={blog.titulo} />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{blog.titulo}</h5>
                  <p className="card-text atributo">{blog.resumen}</p>
                  <Link to={`/blogs/${blog.slug}`} className="btn btn-primario mt-auto">Explorar</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Blogs;
