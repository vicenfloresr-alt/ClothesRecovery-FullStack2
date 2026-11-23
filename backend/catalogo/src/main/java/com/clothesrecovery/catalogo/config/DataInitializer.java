package com.clothesrecovery.catalogo.config;

import com.clothesrecovery.catalogo.model.Producto;
import com.clothesrecovery.catalogo.repository.ProductoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ProductoRepository productoRepository;

    @Override
    public void run(String... args) {
        if (productoRepository.count() > 0) {
            return;
        }

        crear("POL-001", "Polera Oversize Negra", "Algodón pesado, corte oversize.", 8990.0, "Poleras", "M", "/img/productos/polera1.jpg", 8);
        crear("POL-002", "Polera Gráfica Blackletter", "Estampado con tipografía gótica.", 10990.0, "Poleras", "M", "/img/productos/poleras2.jpg", 5);
        crear("POL-003", "Polera Manga Larga Ribbed", "Tejido acanalado, cuello alto.", 11990.0, "Poleras", "M", "/img/productos/polera3.webp", 6);
        crear("POL-004", "Polera Crop Denim", "Corte crop, mezcla denim.", 9990.0, "Poleras", "S", "/img/productos/polera6.jpg", 4);
        crear("PAN-001", "Jeans Slim Gótico", "Slim fit, negro desgastado.", 15990.0, "Pantalones", "32", "/img/productos/pantalon1.webp", 5);
        crear("PAN-002", "Cargo Pants Negro", "Bolsillos laterales, cintura ajustable.", 17990.0, "Pantalones", "32", "/img/productos/cargo1.webp", 3);
        crear("PAN-004", "Jeans Estampado Tattoo", "Estampado gráfico estilo tattoo old school.", 16990.0, "Pantalones", "34", "/img/productos/edhardys.webp", 4);
        crear("CHA-001", "Chaqueta Denim Negra", "Denim rígido teñido negro.", 24990.0, "Chaquetas", "L", "/img/productos/chaqueta1.jpg", 2);
        crear("CHA-002", "Chaqueta Bomber Oversize", "Forro acolchado, corte oversize.", 27990.0, "Chaquetas", "L", "/img/productos/chaqueta2.jpg", 3);
        crear("CAL-001", "Botas Combat Negras", "Suela de goma, 8 hoyos.", 34990.0, "Calzado", "42", "/img/productos/calzado1.jpg", 4);
        crear("CAL-002", "Zapatillas Plataforma", "Plataforma 4cm, cordones anchos.", 29990.0, "Calzado", "40", "/img/productos/calzado2.webp", 6);
    }

    private void crear(String codigo, String nombre, String descripcion, Double precio,
                       String categoria, String talla, String imagen, Integer stock) {
        Producto producto = new Producto();
        producto.setCodigo(codigo);
        producto.setNombreProducto(nombre);
        producto.setDescripcion(descripcion);
        producto.setPrecio(precio);
        producto.setCategoria(categoria);
        producto.setTalla(talla);
        producto.setImagen(imagen);
        producto.setStock(stock);
        productoRepository.save(producto);
    }
}
