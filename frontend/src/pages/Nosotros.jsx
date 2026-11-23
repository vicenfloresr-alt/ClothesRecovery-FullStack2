import EquipoSeccion from '../components/EquipoSeccion';

function Nosotros() {
  return (
    <main>
      <section className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="form-contenedor">
              <img
                src="/img/hero1.jpg"
                className="img-fluid blog-detalle-imagen mb-4"
                alt="Equipo ClothesRecovery"
              />

              <h1 className="text-center mb-2">Nuestra historia</h1>
              <p className="nosotros-intro text-center mb-4">
                ClothesRecovery nació como un proyecto chico con una idea simple: la ropa buena no debería terminar olvidada en un clóset.
              </p>

              <div className="nosotros-intro">
                <h4 className="mb-2">Un comienzo under 🖤</h4>
                <p>
                  Partimos revisando armarios de amigos y ferias de barrio en busca de prendas con historia: chaquetas de cuero, denim desgastado, poleras gráficas que ya no se fabrican. Lo que empezó como un hobby se convirtió rápido en un catálogo curado a mano, pieza por pieza.
                </p>

                <h4 className="mb-2">Crecimiento y comunidad 🖤</h4>
                <p>
                  Con el tiempo, ClothesRecovery se ganó un público fiel: gente que busca streetwear con actitud gótica, sin pagar precios de tienda nueva. Hoy seguimos creciendo gracias a esa comunidad, que nos manda tips de dónde encontrar la próxima pieza.
                </p>

                <h4 className="mb-2">Misión 🖤</h4>
                <p>
                  Darle una segunda vida a prendas con carácter, ofreciendo una curaduría real en vez de simplemente revender ropa usada sin criterio.
                </p>

                <h4 className="mb-2">Visión 🖤</h4>
                <p>
                  Ser la referencia de moda circular gótica y streetwear en Chile, demostrando que comprar de segunda mano puede ser una declaración de estilo, no una concesión.
                </p>
              </div>

              <h2 className="text-center mt-5 mb-2">Nuestro equipo</h2>
              <EquipoSeccion />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Nosotros;
