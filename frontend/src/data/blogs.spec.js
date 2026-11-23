import { obtenerBlogs, obtenerBlogPorSlug, agregarBlog, editarBlog, eliminarBlog } from './blogs';

describe('blogs.js', () => {
  const nuevo = { slug: 'blog-de-prueba', titulo: 'Prueba', imagen: '/img/x.png', parrafos: ['Hola'] };

  afterEach(() => {
    eliminarBlog('blog-de-prueba');
  });

  it('trae los 3 artículos iniciales', () => {
    expect(obtenerBlogs().length).toBe(3);
  });

  it('obtenerBlogPorSlug encuentra un artículo', () => {
    expect(obtenerBlogPorSlug('moda-gotica-datos-curiosos')).not.toBeNull();
  });

  it('obtenerBlogPorSlug devuelve null si no existe', () => {
    expect(obtenerBlogPorSlug('no-existe')).toBeNull();
  });

  it('agregarBlog suma un artículo', () => {
    agregarBlog({ ...nuevo });
    expect(obtenerBlogs().length).toBe(4);
  });

  it('editarBlog cambia el título', () => {
    agregarBlog({ ...nuevo });
    expect(editarBlog('blog-de-prueba', { titulo: 'Nuevo título' })).toBeTrue();
    expect(obtenerBlogPorSlug('blog-de-prueba').titulo).toBe('Nuevo título');
  });

  it('editarBlog devuelve false si el slug no existe', () => {
    expect(editarBlog('no-existe', { titulo: 'x' })).toBeFalse();
  });

  it('eliminarBlog quita el artículo', () => {
    agregarBlog({ ...nuevo });
    eliminarBlog('blog-de-prueba');
    expect(obtenerBlogPorSlug('blog-de-prueba')).toBeNull();
  });
});
