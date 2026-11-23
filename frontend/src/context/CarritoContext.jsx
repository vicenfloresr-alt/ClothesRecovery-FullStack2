import { createContext, useContext, useState, useEffect } from 'react';
import { obtenerProductoPorCodigo } from '../data/productos';

const CarritoContext = createContext(null);
const CLAVE_STORAGE = 'carrito-clothesrecovery';

function leerCarritoGuardado() {
  try {
    const texto = localStorage.getItem(CLAVE_STORAGE);
    if (texto !== null) {
      return JSON.parse(texto);
    }
  } catch (error) {
  }
  return [];
}

export function CarritoProvider({ children }) {
  const [items, setItems] = useState(leerCarritoGuardado);

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_STORAGE, JSON.stringify(items));
    } catch (error) {
    }
  }, [items]);

  function stockDe(codigo) {
    const producto = obtenerProductoPorCodigo(codigo);
    if (producto === null) {
      return 0;
    }
    return producto.stock;
  }

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

  let totalUnidades = 0;
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
