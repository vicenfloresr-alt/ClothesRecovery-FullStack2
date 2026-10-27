import { createContext, useContext, useState, useEffect } from 'react';

// Guarda quién tiene la sesión iniciada. Funciona igual que CarritoContext:
// el estado vive acá, cualquier componente lo lee con useSesion() y se
// guarda en localStorage para que no se pierda al recargar la página.
// Nunca se guarda la contraseña, solo los datos que usa la tienda
// (nombre, apellidos, correo y dirección) para completar el checkout.

const SesionContext = createContext(null);
const CLAVE_STORAGE = 'sesion-clothesrecovery';

function leerSesionGuardada() {
  try {
    const texto = localStorage.getItem(CLAVE_STORAGE);
    if (texto !== null) {
      return JSON.parse(texto);
    }
  } catch (error) {
    // si localStorage no está disponible, partimos sin sesión
  }
  return null;
}

export function SesionProvider({ children }) {
  // usuario: { nombre, apellidos, correo, direccion } o null si no hay sesión
  const [usuario, setUsuario] = useState(leerSesionGuardada);

  useEffect(() => {
    try {
      if (usuario === null) {
        localStorage.removeItem(CLAVE_STORAGE);
      } else {
        localStorage.setItem(CLAVE_STORAGE, JSON.stringify(usuario));
      }
    } catch (error) {
      // si no se puede guardar, la sesión igual funciona en memoria
    }
  }, [usuario]);

  // Recibe el usuario completo de usuarios.js y guarda solo lo necesario
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
