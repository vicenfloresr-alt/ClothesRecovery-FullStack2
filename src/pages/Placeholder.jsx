// Página temporal: marca qué vistas faltan por construir en los
// próximos días del plan (miércoles-jueves). Se reemplaza una por una.
function Placeholder({ titulo }) {
  return (
    <main>
      <section className="container py-5 text-center">
        <h1>{titulo}</h1>
        <p className="atributo">Esta vista se construye en los próximos días del plan.</p>
      </section>
    </main>
  );
}

export default Placeholder;
