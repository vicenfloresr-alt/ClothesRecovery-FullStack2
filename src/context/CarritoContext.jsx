import { createContext, useContext, useState, useEffect } from 'react';
import { obtenerProductoPorCodigo } from '../data/productos';

// Este Context es el reemplazo, en React, de lo que el sitio base hacía
// guardando el carrito en localStorage a mano en cada página.
// Ahora el carrito vive en un solo lugar (acá) y cualquier componente
// que lo necesite lo puede leer o modificar con useCarrito().
// Igual que en el sitio base, el carrito se guarda en localStorage para
// que no se pierda al recargar la página.

const CarritoContext = createContext(null);
const CLAVE_STORAGE = 'carrito-clothesrecovery';

// Lee el carrito guardado (si no hay nada, o falla, parte vacío)
function leerCarritoGuardado() {
  try {
    const texto = localStorage.getItem(CLAVE_STORAGE);
    if (texto !== null) {
      return JSON.parse(texto);
    }
  } catch (error) {
    // si localStorage no está disponible, seguimos con carrito vacío
  }
  return [];
}

export function CarritoProvider({ children }) {
  // items: arreglo de { codigo, nombre, precio, imagen, cantidad }
  const [items, setItems] = useState(leerCarritoGuardado);

  // Cada vez que cambia el carrito, lo guardamos
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_STORAGE, JSON.stringify(items));
    } catch (error) {
      // si no se puede guardar, el carrito igual funciona en memoria
    }
  }, [items]);

  // Stock disponible de un producto (según la "base de datos")
  function stockDe(codigo) {
    const producto = obtenerProductoPorCodigo(codigo);
    if (producto === null) {
      return 0;
    }
    return producto.stock;
  }

  // Devuelve true si se pudo agregar, false si ya estaba el máximo de stock.
  // "producto" debe traer el precio final (con oferta si corresponde).
  function agregarAlCarrito(producto) {
    let yaEstaba = false;
    let seAgrego = true;
    const nuevosItems = [];

    for (let i = 0; i < items.length; i++) {
      if (items[i].codigo === producto.codigo) {
        yaEstaba = true;
        if (items[i].cantidad >= stockDe(producto.codigo)) {
          seAgrego = false;
          nuevosItems.push(items[i]);
        } else {
          nuevosItems.push({ ...items[i], cantidad: items[i].cantidad + 1 });
        }
      } else {
        nuevosItems.push(items[i]);
      }
    }

    if (!yaEstaba) {
      if (stockDe(producto.codigo) < 1) {
        return false;
      }
      nuevosItems.push({
        codigo: producto.codigo,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad: 1,
      });
    }

    setItems(nuevosItems);
    return seAgrego;
  }

  // Cambia la cantidad de un producto sin pasarse del stock
  function cambiarCantidad(codigo, cantidad) {
    if (cantidad < 1 || cantidad > stockDe(codigo)) return;
    const nuevosItems = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].codigo === codigo) {
        nuevosItems.push({ ...items[i], cantidad: cantidad });
      } else {
        nuevosItems.push(items[i]);
      }
    }
    setItems(nuevosItems);
  }

  function eliminarDelCarrito(codigo) {
    const nuevosItems = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].codigo !== codigo) {
        nuevosItems.push(items[i]);
      }
    }
    setItems(nuevosItems);
  }

  function vaciarCarrito() {
    setItems([]);
  }

  // Cantidad total de unidades (para el número rojo del navbar)
  let totalUnidades = 0;
  // Total a pagar
  let totalPrecio = 0;
  for (let i = 0; i < items.length; i++) {
    totalUnidades += items[i].cantidad;
    totalPrecio += items[i].precio * items[i].cantidad;
  }

  const valor = {
    items,
    agregarAlCarrito,
    cambiarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    stockDe,
    totalUnidades,
    totalPrecio,
  };

  return (
    <CarritoContext.Provider value={valor}>
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  return useContext(CarritoContext);
}
