import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrarUsuarioApi } from '../data/usuarios';
import DireccionFields from '../components/DireccionFields';

function Registro() {
  const [form, setForm] = useState({
    run: '',
    nombre: '',
    apellidos: '',
    fechaNacimiento: '',
    correo: '',
    password: '',
    telefono: '',
    calle: '',
    departamento: '',
    region: '',
    comuna: '',
    indicaciones: '',
  });
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  function cambiarCampo(nombre, valor) {
    setForm((anterior) => ({ ...anterior, [nombre]: valor }));
  }

  function manejarCambio(evento) {
    cambiarCampo(evento.target.name, evento.target.value);
  }

  async function manejarSubmit(evento) {
    evento.preventDefault();

    if (!form.run || !form.nombre || !form.apellidos || !form.fechaNacimiento || !form.correo || !form.password) {
      setError('Completa todos los campos obligatorios.');
      setExito(false);
      return;
    }

    setEnviando(true);

    try {
      await registrarUsuarioApi({
        nombre: form.nombre + ' ' + form.apellidos,
        correo: form.correo,
        password: form.password,
        telefono: form.telefono,
      });
      setError('');
      setExito(true);
      setTimeout(() => navigate('/login'), 1200);
    } catch (e) {
      setError(e.message);
      setExito(false);
      setEnviando(false);
    }
  }

  return (
    <main>
      <section className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="form-contenedor">
              <h2 className="mb-1 text-center">Registro de nuevo usuario</h2>
              <p className="form-subtitulo text-center">Bienvenido a ClothesRecovery</p>

              {error && <div className="mensaje-error mb-3 text-center" style={{ display: 'block' }}>{error}</div>}
              {exito && (
                <div className="mensaje-error mb-3 text-center" style={{ display: 'block', color: '#3a7d44' }}>
                  Cuenta creada. Redirigiendo a inicio de sesión...
                </div>
              )}

              <form onSubmit={manejarSubmit}>
                <div className="row">
                  <div className="col-md-6 form-grupo mb-3">
                    <label htmlFor="run" className="form-label">RUN <span className="opcional">obligatorio</span></label>
                    <input type="text" className="form-control" id="run" name="run" placeholder="ej: 11111111-1" value={form.run} onChange={manejarCambio} required />
                  </div>
                  <div className="col-md-6 form-grupo mb-3">
                    <label htmlFor="fechaNacimiento" className="form-label">Fecha de nacimiento <span className="opcional">obligatorio</span></label>
                    <input type="date" className="form-control" id="fechaNacimiento" name="fechaNacimiento" value={form.fechaNacimiento} onChange={manejarCambio} required />
                  </div>
                  <div className="col-md-6 form-grupo mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre <span className="opcional">obligatorio</span></label>
                    <input type="text" className="form-control" id="nombre" name="nombre" value={form.nombre} onChange={manejarCambio} required />
                  </div>
                  <div className="col-md-6 form-grupo mb-3">
                    <label htmlFor="apellidos" className="form-label">Apellidos <span className="opcional">obligatorio</span></label>
                    <input type="text" className="form-control" id="apellidos" name="apellidos" value={form.apellidos} onChange={manejarCambio} required />
                  </div>
                  <div className="col-md-6 form-grupo mb-3">
                    <label htmlFor="correo" className="form-label">Correo <span className="opcional">obligatorio</span></label>
                    <input type="email" className="form-control" id="correo" name="correo" value={form.correo} onChange={manejarCambio} required />
                  </div>
                  <div className="col-md-6 form-grupo mb-3">
                    <label htmlFor="password" className="form-label">Contraseña <span className="opcional">obligatorio</span></label>
                    <input type="password" className="form-control" id="password" name="password" value={form.password} onChange={manejarCambio} required />
                  </div>
                  <div className="col-md-6 form-grupo mb-3">
                    <label htmlFor="telefono" className="form-label">Teléfono <span className="opcional">opcional</span></label>
                    <input type="tel" className="form-control" id="telefono" name="telefono" placeholder="ej: 912345678" value={form.telefono} onChange={manejarCambio} />
                  </div>
                </div>

                <hr style={{ borderColor: '#2a2a2e' }} />
                <h4 className="mb-1">Dirección de entrega</h4>
                <p className="form-subtitulo">Ingresa tu dirección de forma detallada</p>

                <DireccionFields valores={form} onCambiar={cambiarCampo} />

                <div className="text-end">
                  <button type="submit" className="btn btn-primario" disabled={enviando}>Guardar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Registro;
