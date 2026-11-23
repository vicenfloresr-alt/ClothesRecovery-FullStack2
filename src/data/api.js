export const API_URL = 'http://localhost:9090/api/v1';

export const CLAVE_SESION = 'sesion-clothesrecovery';

export function leerToken() {
  try {
    const texto = localStorage.getItem(CLAVE_SESION);
    if (texto !== null) {
      const sesion = JSON.parse(texto);
      if (sesion !== null && sesion.token) {
        return sesion.token;
      }
    }
  } catch (error) {
  }
  return null;
}

export async function pedirApi(ruta, opciones = {}) {
  const encabezados = { 'Content-Type': 'application/json' };
  const token = leerToken();
  if (token !== null) {
    encabezados.Authorization = 'Bearer ' + token;
  }

  const configuracion = {
    method: opciones.method || 'GET',
    headers: encabezados,
  };
  if (opciones.body !== undefined) {
    configuracion.body = JSON.stringify(opciones.body);
  }

  const respuesta = await fetch(API_URL + ruta, configuracion);

  const texto = await respuesta.text();
  let datos = null;
  if (texto !== '') {
    try {
      datos = JSON.parse(texto);
    } catch (error) {
      datos = texto;
    }
  }

  if (!respuesta.ok) {
    let mensaje = 'Error ' + respuesta.status + ' al comunicarse con el servidor.';
    if (datos !== null && datos.error) {
      mensaje = datos.error;
    }
    const error = new Error(mensaje);
    error.status = respuesta.status;
    throw error;
  }

  return datos;
}
