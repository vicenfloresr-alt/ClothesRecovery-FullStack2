import { Link } from 'react-router-dom';

// Tarjeta de categoría con la misma estructura que usa el template base
// (card + card-img-top + card-body + botón "Explorar"), con nuestros
// colores encima.
function CategoriaCard({ categoria }) {
  return (
    <div className="col-md-3 col-6">
      <div className="card tarjeta-categoria h-100">
        <img src={categoria.imagen} className="card-img-top" alt={categoria.nombre} />
        <div className="card-body">
          <h3 className="card-title" style={{ fontSize: '18px', color: '#e8e2d8' }}>{categoria.nombre}</h3>
          <p className="card-text atributo">{categoria.descripcion}</p>
          <Link to={`/categorias/${categoria.nombre}`} className="btn btn-primario w-100">Explorar</Link>
        </div>
      </div>
    </div>
  );
}

export default CategoriaCard;
