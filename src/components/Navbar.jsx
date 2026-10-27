import { NavLink, Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { obtenerCategorias } from '../data/categorias';
import { formatearPrecio } from '../data/productos';

// Este Navbar sigue la misma estructura que el index.html de la plantilla
// base (Anexo 3): navbar superior con logo + buscador + login/crear cuenta,
// navbar inferior con el menú de navegación, y un offcanvas para el menú
// en pantallas chicas. Lo único que cambia es la marca y los colores.

function Navbar() {
  const { totalUnidades, totalPrecio } = useCarrito();
  const categorias = obtenerCategorias();

  return (
    <header className="site-header">
      {/* Navbar superior */}
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <Link className="logo" to="/">Clothes<span>Recovery</span></Link>

          <div className="collapse navbar-collapse justify-content-center d-none d-lg-flex">
            <form className="d-flex" role="search" onSubmit={(e) => e.preventDefault()}>
              <input className="form-control me-2" type="search" placeholder="Buscar" aria-label="Buscar" />
              <button className="btn btn-secundario" type="submit">Buscar</button>
            </form>
          </div>

          <div className="d-flex align-items-center">
            <NavLink to="/login" className="btn btn-secundario ms-2 d-none d-lg-inline-block">Iniciar sesión</NavLink>
            <NavLink to="/registro" className="btn btn-primario ms-2 d-none d-lg-inline-block">Crear cuenta</NavLink>
            <button
              className="btn btn-primario d-lg-none ms-2"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasMenu"
              aria-controls="offcanvasMenu"
            >
              <i className="bi bi-list"></i> Menú
            </button>
          </div>
        </div>
      </nav>

      {/* Navbar inferior (menú principal, solo escritorio) */}
      <nav className="navbar navbar-expand-lg d-none d-lg-block">
        <div className="container-fluid">
          <div className="collapse navbar-collapse justify-content-center">
            <ul className="main-nav nav">
              <li className="nav-item">
                <NavLink to="/" end className="nav-link">Home</NavLink>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Categorías
                </a>
                <ul className="dropdown-menu">
                  {categorias.map((categoria) => (
                    <li key={categoria.nombre}>
                      <Link className="dropdown-item" to={`/categorias/${categoria.nombre}`}>{categoria.nombre}</Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="nav-item"><NavLink to="/ofertas" className="nav-link">Ofertas</NavLink></li>
              <li className="nav-item"><NavLink to="/nosotros" className="nav-link">Nosotros</NavLink></li>
              <li className="nav-item"><NavLink to="/blogs" className="nav-link">Blogs</NavLink></li>
              <li className="nav-item"><NavLink to="/contacto" className="nav-link">Contacto</NavLink></li>
              <li className="nav-item">
                <Link to="/carrito" className="btn btn-primario ms-4">
                  <i className="bi bi-cart4"></i> Carrito{' '}
                  <span className="cart-count">{totalUnidades}</span>
                  {totalUnidades > 0 && <strong> {formatearPrecio(totalPrecio)}</strong>}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Offcanvas: menú para pantallas chicas */}
      <div className="offcanvas offcanvas-start text-bg-dark" tabIndex="-1" id="offcanvasMenu" aria-labelledby="offcanvasMenuLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasMenuLabel">Menú</h5>
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <ul className="list-unstyled main-nav">
            <li className="mb-3"><NavLink to="/" end className="nav-link" data-bs-dismiss="offcanvas">Home</NavLink></li>
            {categorias.map((categoria) => (
              <li className="mb-3" key={categoria.nombre}>
                <Link className="nav-link" to={`/categorias/${categoria.nombre}`} data-bs-dismiss="offcanvas">
                  Categoría: {categoria.nombre}
                </Link>
              </li>
            ))}
            <li className="mb-3"><NavLink to="/ofertas" className="nav-link" data-bs-dismiss="offcanvas">Ofertas</NavLink></li>
            <li className="mb-3"><NavLink to="/nosotros" className="nav-link" data-bs-dismiss="offcanvas">Nosotros</NavLink></li>
            <li className="mb-3"><NavLink to="/blogs" className="nav-link" data-bs-dismiss="offcanvas">Blogs</NavLink></li>
            <li className="mb-3"><NavLink to="/contacto" className="nav-link" data-bs-dismiss="offcanvas">Contacto</NavLink></li>
            <li className="mb-3"><NavLink to="/login" className="nav-link" data-bs-dismiss="offcanvas">Iniciar sesión</NavLink></li>
            <li className="mb-3"><NavLink to="/registro" className="nav-link" data-bs-dismiss="offcanvas">Crear cuenta</NavLink></li>
            <li>
              <Link to="/carrito" className="btn btn-primario w-100" data-bs-dismiss="offcanvas">
                <i className="bi bi-cart4"></i> Carrito ({totalUnidades})
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
