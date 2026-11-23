let usuarios = [
  {
    run: '11111111-1',
    nombre: 'Pixu',
    apellidos: 'Admin',
    correo: 'pixu@clothesrecovery.cl',
    password: '12345',
    fechaNacimiento: '2000-01-01',
    direccion: {
      calle: 'Av. Siempre Viva 123',
      departamento: '',
      region: 1000,
      comuna: 1028,
      indicaciones: '',
    },
  },
];

export function obtenerUsuarios() {
  return usuarios;
}

export function obtenerUsuarioPorCorreo(correo) {
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].correo === correo) {
      return usuarios[i];
    }
  }
  return null;
}

export function existeCorreo(correo) {
  return obtenerUsuarioPorCorreo(correo) !== null;
}

export function validarCredenciales(correo, password) {
  const usuario = obtenerUsuarioPorCorreo(correo);
  if (usuario !== null && usuario.password === password) {
    return usuario;
  }
  return null;
}

export function agregarUsuario(nuevoUsuario) {
  usuarios.push(nuevoUsuario);
}

export function editarUsuario(correo, datosNuevos) {
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].correo === correo) {
      for (const clave in datosNuevos) {
        usuarios[i][clave] = datosNuevos[clave];
      }
      return true;
    }
  }
  return false;
}

export function eliminarUsuario(correo) {
  const restantes = [];
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].correo !== correo) {
      restantes.push(usuarios[i]);
    }
  }
  usuarios = restantes;
}
