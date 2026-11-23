import { createContext, useContext, useState, useEffect } from 'react';
import { CLAVE_SESION } from '../data/api';

const SesionContext = createContext(null);
const CLAVE_STORAGE = CLAVE_SESION;

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
      correo: datosUsuario.username,
      rol: datosUsuario.rol,
      clienteId: datosUsuario.clienteId,
      token: datosUsuario.token,
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
