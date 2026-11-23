import { useState, useEffect } from 'react';
import { listarClientesApi } from '../data/clientes';

function AdminClientes() {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  async function cargarClientes() {
    try {
      const lista = await listarClientesApi();
      setClientes(lista);
      setError('');
    } catch (e) {
      setError(e.message);
    }
    setCargando(false);
  }

  useEffect(() => {
    cargarClientes();
  }, []);

  if (cargando) {
    return <p className="atributo">Cargando clientes...</p>;
  }

  return (
    <div>
      {error && <p className="mensaje-error">{error}</p>}

      {clientes.length === 0 ? (
        <p className="mensaje-estado">Aún no hay clientes registrados.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="fila-cliente-admin">
                  <td>{cliente.id}</td>
                  <td>{cliente.nombreCompleto}</td>
                  <td>{cliente.correo}</td>
                  <td>{cliente.telefono}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminClientes;
