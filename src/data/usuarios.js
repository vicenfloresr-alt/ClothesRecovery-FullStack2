// "Base de datos" simulada de usuarios, igual que productos.js y categorias.js.
// Se usa en Login (validar credenciales) y en Registro (crear cuenta nueva).
// Trae un par de cuentas de ejemplo para poder probar el login sin
// necesidad de registrarse primero.

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

// ---------- CRUD ----------

// Leer todos
export function obtenerUsuarios() {
  return usuarios;
}

// Leer uno por correo
export function obtenerUsuarioPorCorreo(correo) {
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].correo === correo) {
      return usuarios[i];
    }
  }
  return null;
}

// Validar si ya existe una cuenta con ese correo (para el registro)
export function existeCorreo(correo) {
  return obtenerUsuarioPorCorreo(correo) !== null;
}

// Validar credenciales de login: devuelve el usuario si calzan, o null
export function validarCredenciales(correo, password) {
  const usuario = obtenerUsuarioPorCorreo(correo);
  if (usuario !== null && usuario.password === password) {
    return usuario;
  }
  return null;
}

// Crear
export function agregarUsuario(nuevoUsuario) {
  usuarios.push(nuevoUsuario);
}

// Actualizar
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

// Eliminar
export function eliminarUsuario(correo) {
  const restantes = [];
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].correo !== correo) {
      restantes.push(usuarios[i]);
    }
  }
  usuarios = restantes;
}
