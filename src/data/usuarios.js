import { pedirApi } from './api';

export async function iniciarSesionApi(correo, password) {
  return pedirApi('/auth/login', {
    method: 'POST',
    body: { username: correo, password: password },
  });
}

export async function registrarUsuarioApi(datos) {
  return pedirApi('/auth/registro', {
    method: 'POST',
    body: {
      nombre: datos.nombre,
      username: datos.correo,
      password: datos.password,
      telefono: datos.telefono || '',
    },
  });
}
