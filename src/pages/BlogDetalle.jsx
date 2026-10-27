import { useParams, Link } from 'react-router-dom';
import { obtenerBlogPorSlug } from '../data/blogs';
import EquipoSeccion from '../components/EquipoSeccion';

// Misma estructura que blog-items.html del sitio base: breadcrumb,
// tarjeta con imagen + texto del post, y el mismo bloque de equipo al
// final que trae la plantilla.
function BlogDetalle() {
  const { slug } = useParams();
  const blog = obtenerBlogPorSlug(slug);

  if (blog === null) {
    return (
      <main>
        <section className="container py-5 text-center">
          <h1>Blog no encontrado</h1>
          <Link to="/blogs" className="volver-link">&larr; Volver a Blogs</Link>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/blogs">Blogs</Link></li>
                <li className="breadcrumb-item active" aria-current="page">{blog.titulo}</li>
              </ol>
            </nav>

            <article className="blog-detalle">
              <h1>{blog.titulo}</h1>

              <img src={blog.imagen} className="img-fluid blog-detalle-imagen" alt={blog.titulo} />

              {blog.parrafos.map((parrafo, indice) => (
                <p key={indice}>{parrafo}</p>
              ))}

              <h2 className="text-center mt-5 mb-2">Quién lo escribió</h2>
              <EquipoSeccion />

              <div className="text-center mt-4">
                <Link to="/blogs" className="volver-link">&larr; Volver a Blogs</Link>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}

export default BlogDetalle;
