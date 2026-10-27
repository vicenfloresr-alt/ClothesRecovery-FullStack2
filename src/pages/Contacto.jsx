import { useState } from 'react';

// Misma estructura que contacto.html del sitio base: una tarjeta centrada
// con título "Contacto" y un formulario de nombre, email y mensaje.
// No hay servidor, así que al enviar solo se muestra una confirmación.
function Contacto() {
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' });
  const [enviado, setEnviado] = useState(false);

  function manejarCambio(evento) {
    const { name, value } = evento.target;
    setForm((anterior) => ({ ...anterior, [name]: value }));
    setEnviado(false);
  }

  function manejarSubmit(evento) {
    evento.preventDefault();
    setEnviado(true);
    setForm({ nombre: '', email: '', mensaje: '' });
  }

  return (
    <main>
      <section className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="form-contenedor">
              <h2 className="text-center mb-4">Contacto</h2>

              {enviado && (
                <p className="text-center" style={{ color: '#3a7d44' }}>
                  ¡Gracias por escribirnos! Te responderemos pronto.
                </p>
              )}

              <form onSubmit={manejarSubmit}>
                <div className="form-grupo mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre</label>
                  <input type="text" className="form-control" id="nombre" name="nombre" placeholder="Tu nombre" value={form.nombre} onChange={manejarCambio} required />
                </div>
                <div className="form-grupo mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" className="form-control" id="email" name="email" placeholder="Tu correo electrónico" value={form.email} onChange={manejarCambio} required />
                </div>
                <div className="form-grupo mb-3">
                  <label htmlFor="mensaje" className="form-label">Mensaje</label>
                  <textarea className="form-control" id="mensaje" name="mensaje" rows="4" placeholder="Tu mensaje" value={form.mensaje} onChange={manejarCambio} required></textarea>
                </div>
                <div className="text-end">
                  <button type="submit" className="btn btn-primario">Enviar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contacto;
