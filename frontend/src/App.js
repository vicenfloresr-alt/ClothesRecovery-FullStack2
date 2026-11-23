import { Routes, Route } from 'react-router-dom';
import { CarritoProvider } from './context/CarritoContext';
import { SesionProvider } from './context/SesionContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Productos from './pages/Productos';
import ProductoDetalle from './pages/ProductoDetalle';
import Categorias from './pages/Categorias';
import Ofertas from './pages/Ofertas';
import Nosotros from './pages/Nosotros';
import Blogs from './pages/Blogs';
import BlogDetalle from './pages/BlogDetalle';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Carrito from './pages/Carrito';
import Comprar from './pages/Comprar';
import CompraResultado from './pages/CompraResultado';

function App() {
  return (
    <SesionProvider>
    <CarritoProvider>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/productos/:codigo" element={<ProductoDetalle />} />
        <Route path="/categorias/:nombre" element={<Categorias />} />
        <Route path="/ofertas" element={<Ofertas />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:slug" element={<BlogDetalle />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/comprar" element={<Comprar />} />
        <Route path="/comprar/ok/:numero" element={<CompraResultado exito={true} />} />
        <Route path="/comprar/error/:numero" element={<CompraResultado exito={false} />} />
      </Routes>

      <Footer />
    </CarritoProvider>
    </SesionProvider>
  );
}

export default App;
