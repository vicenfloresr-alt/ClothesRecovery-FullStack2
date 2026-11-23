import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSesion } from '../context/SesionContext';
import AdminProductos from '../components/AdminProductos';
import AdminPedidos from '../components/AdminPedidos';
import AdminClientes from '../components/AdminClientes';

function Admin() {
  const { usuario } = useSesion();
  const [seccion, setSeccion] = useState('productos');

  if (usuario === null || (usuario.rol !== 'ADMIN' && usuario.rol !== 'VENDEDOR')) {
    return (
      <main>
        <section className="container py-5 text-center">
          <h1>Acceso restringido</h1>
          <p className="atributo">Esta sección es solo para administradores y vendedores.</p>
          <Link to="/login" className="btn btn-primario">Iniciar sesión</Link>
        </section>
      </main>
    );
  }

  const esAdmin = usuario.rol === 'ADMIN';

  function claseTab(nombre) {
    return 'nav-link tab-panel' + (seccion === nombre ? ' active' : '');
  }

  return (
    <main>
      <section className="container py-5">
        <h1 className="mb-1">{esAdmin ? 'Panel de administración' : 'Panel de vendedor'}</h1>
        <p className="atributo mb-4">Sesión iniciada como {usuario.nombre} ({usuario.rol})</p>

        <ul className="nav nav-tabs tabs-panel mb-4">
          <li className="nav-item">
            <button type="button" className={claseTab('productos')} onClick={() => setSeccion('productos')}>Productos</button>
          </li>
          <li className="nav-item">
            <button type="button" className={claseTab('pedidos')} onClick={() => setSeccion('pedidos')}>Pedidos</button>
          </li>
          {esAdmin && (
            <li className="nav-item">
              <button type="button" className={claseTab('clientes')} onClick={() => setSeccion('clientes')}>Clientes</button>
            </li>
          )}
        </ul>

        {seccion === 'productos' && <AdminProductos esAdmin={esAdmin} />}
        {seccion === 'pedidos' && <AdminPedidos />}
        {seccion === 'clientes' && esAdmin && <AdminClientes />}
      </section>
    </main>
  );
}

export default Admin;
