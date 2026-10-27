// El sitio base repite este mismo bloque de "equipo" al final tanto de
// nosotros.html como de blog-items.html, así que lo dejamos como un
// componente aparte para no repetir el JSX dos veces.
const equipo = [
  {
    nombre: 'Benjamín Obreque',
    rol: 'Dueño de ClothesRecovery',
    descripcion: 'A cargo del negocio y la visión de marca.',
    imagen: '/img/equipo/bo.png',
  },
  {
    nombre: 'Matías Obreque',
    rol: 'Hermano del dueño',
    descripcion: 'Ayudó con el desarrollo de la página.',
    imagen: '/img/equipo/mo.png',
  },
  {
    nombre: 'Vicente Flores',
    rol: 'Único desarrollador',
    descripcion: 'Construyó la tienda de principio a fin.',
    imagen: '/img/equipo/vf.png',
  },
];

function EquipoSeccion() {
  return (
    <div className="row g-4 mt-2">
      {equipo.map((persona) => (
        <div className="col-md-4" key={persona.nombre}>
          <div className="tarjeta-equipo h-100">
            <img
              src={persona.imagen}
              className="rounded-circle mb-3"
              width="110"
              height="110"
              alt={persona.nombre}
            />
            <h3>{persona.nombre}</h3>
            <p className="rol">{persona.rol}</p>
            <p>{persona.descripcion}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EquipoSeccion;
