import { regiones, comunas, obtenerNombreRegion, obtenerNombreComuna } from './zonas';
import { obtenerCategorias, obtenerCategoriaPorNombre } from './categorias';

describe('zonas.js', () => {
  it('tiene las 16 regiones de Chile', () => {
    expect(regiones.length).toBe(16);
  });

  it('obtenerNombreRegion devuelve el nombre según el id', () => {
    expect(obtenerNombreRegion(1000)).toBe('Región Metropolitana de Santiago');
  });

  it('obtenerNombreRegion acepta el id como texto (viene de un select)', () => {
    expect(obtenerNombreRegion('1000')).toBe('Región Metropolitana de Santiago');
  });

  it('obtenerNombreRegion devuelve vacío si no existe', () => {
    expect(obtenerNombreRegion(999999)).toBe('');
  });

  it('obtenerNombreComuna devuelve el nombre según el id', () => {
    expect(obtenerNombreComuna(1001)).toBe('Cerrillos');
  });

  it('obtenerNombreComuna devuelve vacío si no existe', () => {
    expect(obtenerNombreComuna(0)).toBe('');
  });

  it('cada comuna pertenece a una región que existe', () => {
    for (let i = 0; i < comunas.length; i++) {
      expect(obtenerNombreRegion(comunas[i].id_region)).not.toBe('');
    }
  });
});

describe('categorias.js', () => {
  it('tiene 4 categorías', () => {
    expect(obtenerCategorias().length).toBe(4);
  });

  it('obtenerCategoriaPorNombre encuentra una categoría', () => {
    expect(obtenerCategoriaPorNombre('Calzado').nombre).toBe('Calzado');
  });

  it('obtenerCategoriaPorNombre devuelve null si no existe', () => {
    expect(obtenerCategoriaPorNombre('Sombreros')).toBeNull();
  });
});
