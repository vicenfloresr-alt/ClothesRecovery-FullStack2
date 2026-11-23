export function respuestaJson(datos, status = 200) {
  if (datos === null || datos === undefined) {
    return Promise.resolve(new Response(null, { status: status }));
  }
  return Promise.resolve(
    new Response(JSON.stringify(datos), {
      status: status,
      headers: { 'Content-Type': 'application/json' },
    })
  );
}

export function simularApi(reglas) {
  return spyOn(window, 'fetch').and.callFake((url, opciones) => {
    const metodo = (opciones && opciones.method) || 'GET';
    for (let i = 0; i < reglas.length; i++) {
      const regla = reglas[i];
      const mismoMetodo = (regla.metodo || 'GET') === metodo;
      if (mismoMetodo && url.endsWith(regla.ruta)) {
        if (regla.falla) {
          return Promise.reject(new TypeError('Failed to fetch'));
        }
        return respuestaJson(regla.datos, regla.status || 200);
      }
    }
    return respuestaJson({ error: 'Ruta no simulada: ' + metodo + ' ' + url }, 404);
  });
}

export function cuerpoEnviado(espia, indice) {
  return JSON.parse(espia.calls.argsFor(indice)[1].body);
}

export function llamadasA(espia, metodo, ruta) {
  const resultado = [];
  const todas = espia.calls.allArgs();
  for (let i = 0; i < todas.length; i++) {
    const url = todas[i][0];
    const opciones = todas[i][1] || {};
    if ((opciones.method || 'GET') === metodo && url.endsWith(ruta)) {
      resultado.push(todas[i]);
    }
  }
  return resultado;
}

export function sesionComo(rol, extra = {}) {
  const sesion = {
    nombre: rol === 'CLIENTE' ? 'Ana Pérez' : rol === 'ADMIN' ? 'Administrador' : 'Vendedor',
    correo: rol.toLowerCase() + '@clothesrecovery.cl',
    rol: rol,
    clienteId: rol === 'CLIENTE' ? 3 : null,
    token: 'token-de-prueba',
  };
  localStorage.setItem('sesion-clothesrecovery', JSON.stringify({ ...sesion, ...extra }));
  return sesion;
}
