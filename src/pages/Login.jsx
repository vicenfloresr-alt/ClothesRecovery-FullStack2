import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { validarCredenciales } from '../data/usuarios';

// Misma estructura que iniciar-sesion.html del sitio base: una tarjeta
// con imagen a la izquierda y formulario a la derecha, alerta de error,
// link a registro y a "olvidé mi contraseña". La plantilla validaba
// contra credenciales fijas en el script; acá se valida contra nuestra
// "base de datos" simulada de usuarios.data/usuarios.js.
function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  function manejarSubmit(evento) {
    evento.preventDefault();
    const usuario = validarCredenciales(correo, password);
    if (usuario !== null) {
      setError(false);
      navigate('/');
    } else {
      setError(true);
    }
  }

  return (
    <main>
      <section className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="form-contenedor row">
              <div className="col-md-6 d-none d-md-block">
                <img src="/img/hero1.jpg" className="img-fluid blog-detalle-imagen" alt="ClothesRecovery" />
              </div>
              <div className="col-md-6">
                <h2 className="mb-4 text-center">Iniciar sesión</h2>

                {error && (
                  <div className="mensaje-error mb-3" style={{ display: 'block', textAlign: 'center' }}>
                    Correo o contraseña incorrectos.
                  </div>
                )}

                <form onSubmit={manejarSubmit}>
                  <div className="form-grupo mb-3">
                    <label htmlFor="correo" className="form-label">Correo</label>
                    <input
                      type="email"
                      className="form-control"
                      id="correo"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-grupo mb-3">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3 d-flex justify-content-between">
                    <Link to="/registro">¿No tienes cuenta? Regístrate aquí</Link>
                  </div>

                  <button type="submit" className="btn btn-primario w-100">INICIAR SESIÓN</button>

                  <p className="pista text-center mt-3">
                    Prueba con <strong>pixu@clothesrecovery.cl</strong> / <strong>12345</strong>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;
