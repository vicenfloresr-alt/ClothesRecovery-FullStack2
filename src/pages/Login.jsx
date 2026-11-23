import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { iniciarSesionApi } from '../data/usuarios';
import { useSesion } from '../context/SesionContext';

function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();
  const { iniciarSesion } = useSesion();

  async function manejarSubmit(evento) {
    evento.preventDefault();
    setError('');
    setEnviando(true);

    try {
      const usuario = await iniciarSesionApi(correo, password);
      iniciarSesion(usuario);
      if (usuario.rol === 'ADMIN' || usuario.rol === 'VENDEDOR') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (e) {
      if (e.status === 401) {
        setError('Correo o contraseña incorrectos.');
      } else {
        setError('No se pudo conectar con el servidor. Intenta más tarde.');
      }
      setEnviando(false);
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
                    {error}
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

                  <button type="submit" className="btn btn-primario w-100" disabled={enviando}>
                    {enviando ? 'INGRESANDO...' : 'INICIAR SESIÓN'}
                  </button>
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
