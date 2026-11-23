function Footer() {
  return (
    <footer className="site-footer py-5 mt-4">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <p className="logo">ClothesRecovery</p>
            <p>&copy; 2026 Todos los derechos reservados.</p>
          </div>
          <div className="col-md-4">
            <h4>Categorías</h4>
            <div className="footer-col">
              <a href="/categorias/Poleras">Poleras</a>
              <a href="/categorias/Pantalones">Pantalones</a>
              <a href="/categorias/Chaquetas">Chaquetas</a>
              <a href="/categorias/Calzado">Calzado</a>
            </div>
          </div>
          <div className="col-md-4">
            <h4>Mantente al tanto</h4>
            <form className="input-group" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="newsletter-email" className="sr-only">Correo electrónico</label>
              <input type="email" id="newsletter-email" className="form-control" placeholder="Ingresa tu correo" />
              <button type="submit" className="btn btn-secundario">Suscribirme</button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
