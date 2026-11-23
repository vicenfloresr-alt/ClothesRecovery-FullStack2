import {
  obtenerUsuarios,
  obtenerUsuarioPorCorreo,
  existeCorreo,
  validarCredenciales,
  agregarUsuario,
  editarUsuario,
  eliminarUsuario,
} from './usuarios';

describe('usuarios.js', () => {
  const nuevo = {
    run: '22222222-2',
    nombre: 'Test',
    apellidos: 'Usuario',
    correo: 'test@clothesrecovery.cl',
    password: 'abc123',
    fechaNacimiento: '2001-02-03',
    direccion: { calle: 'Calle 1', departamento: '', region: 1000, comuna: 1001, indicaciones: '' },
  };

  afterEach(() => {
    eliminarUsuario('test@clothesrecovery.cl');
  });

  it('trae el usuario de ejemplo', () => {
    expect(obtenerUsuarios().length).toBeGreaterThan(0);
    expect(obtenerUsuarioPorCorreo('pixu@clothesrecovery.cl')).not.toBeNull();
  });

  it('obtenerUsuarioPorCorreo devuelve null si no existe', () => {
    expect(obtenerUsuarioPorCorreo('nadie@correo.cl')).toBeNull();
  });

  it('existeCorreo distingue correos registrados de los que no', () => {
    expect(existeCorreo('pixu@clothesrecovery.cl')).toBeTrue();
    expect(existeCorreo('nadie@correo.cl')).toBeFalse();
  });

  describe('validarCredenciales', () => {
    it('devuelve el usuario cuando correo y clave calzan', () => {
      const usuario = validarCredenciales('pixu@clothesrecovery.cl', '12345');
      expect(usuario).not.toBeNull();
      expect(usuario.nombre).toBe('Pixu');
    });

    it('devuelve null con clave incorrecta', () => {
      expect(validarCredenciales('pixu@clothesrecovery.cl', 'mala')).toBeNull();
    });

    it('devuelve null con correo inexistente', () => {
      expect(validarCredenciales('nadie@correo.cl', '12345')).toBeNull();
    });
  });

  describe('crear, editar y eliminar', () => {
    it('agregarUsuario permite iniciar sesión con la cuenta nueva', () => {
      agregarUsuario({ ...nuevo });
      expect(existeCorreo('test@clothesrecovery.cl')).toBeTrue();
      expect(validarCredenciales('test@clothesrecovery.cl', 'abc123')).not.toBeNull();
    });

    it('editarUsuario cambia los datos y devuelve true', () => {
      agregarUsuario({ ...nuevo });
      expect(editarUsuario('test@clothesrecovery.cl', { nombre: 'Cambiado' })).toBeTrue();
      expect(obtenerUsuarioPorCorreo('test@clothesrecovery.cl').nombre).toBe('Cambiado');
    });

    it('editarUsuario devuelve false si el correo no existe', () => {
      expect(editarUsuario('nadie@correo.cl', { nombre: 'X' })).toBeFalse();
    });

    it('eliminarUsuario borra la cuenta', () => {
      agregarUsuario({ ...nuevo });
      eliminarUsuario('test@clothesrecovery.cl');
      expect(existeCorreo('test@clothesrecovery.cl')).toBeFalse();
    });
  });
});
