import { createContext, useContext, useState, useEffect } from 'react';
import { listarProductos } from '../data/productos';

const ProductosContext = createContext({
  productos: [],
  cargando: false,
  error: '',
  recargarProductos: async () => {},
});

export function ProductosProvider({ children, productosIniciales }) {
  const [productos, setProductos] = useState(productosIniciales || []);
  const [cargando, setCargando] = useState(productosIniciales === undefined);
  const [error, setError] = useState('');

  async function recargarProductos() {
    try {
      const lista = await listarProductos();
      setProductos(lista);
      setError('');
    } catch (e) {
      setError('No se pudo conectar con el servidor. Revisa que el backend esté encendido.');
    }
    setCargando(false);
  }

  useEffect(() => {
    if (productosIniciales === undefined) {
      recargarProductos();
    }
  }, []);

  const valor = { productos, cargando, error, recargarProductos };

  return (
    <ProductosContext.Provider value={valor}>
      {children}
    </ProductosContext.Provider>
  );
}

export function useProductos() {
  return useContext(ProductosContext);
}
