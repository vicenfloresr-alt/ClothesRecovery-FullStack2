import { createContext, useContext, useState, useEffect } from 'react';

const SesionContext = createContext(null);
const CLAVE_STORAGE = 'sesion-clothesrecovery';

function leerSesionGuardada() {
  try {
    const texto = localStorage.getItem(CLAVE_STORAGE);
    if (texto !== null) {
      return JSON.parse(texto);
    }
  } catch (error) {
  }
  return null;
}

export function SesionProvider({ children }) {
  const [usuario, setUsuario] = useState(leerSesionGuardada);

  useEffect(() => {
    try {
      if (usuario === null) {
        localStorage.removeItem(CLAVE_STORAGE);
      } else {
        localStorage.setItem(CLAVE_STORAGE, JSON.stringify(usuario));
      }
    } catch (error) {
    }
  }, [usuario]);

  function iniciarSesion(datosUsuario) {
    setUsuario({
      nombre: datosUsuario.nombre,
      apellidos: datosUsuario.apellidos,
      correo: datosUsuario.correo,
      direccion: datosUsuario.direccion,
    });
  }

  function cerrarSesion() {
    setUsuario(null);
  }

  const valor = { usuario, iniciarSesion, cerrarSesion };

  return (
    <SesionContext.Provider value={valor}>
      {children}
    </SesionContext.Provider>
  );
}

export function useSesion() {
  return useContext(SesionContext);
}
