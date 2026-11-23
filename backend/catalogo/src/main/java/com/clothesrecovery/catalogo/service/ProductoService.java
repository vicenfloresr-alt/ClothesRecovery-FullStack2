package com.clothesrecovery.catalogo.service;

import com.clothesrecovery.catalogo.model.Producto;
import com.clothesrecovery.catalogo.repository.ProductoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    public List<Producto> listarProductos() {
        return productoRepository.findAll();
    }

    public Producto buscarProductoPorId(Long id) {
        return productoRepository.findById(id).orElse(null);
    }

    public Producto guardarProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    public Producto actualizarProducto(Long id, Producto productoActualizado) {

        Producto producto = productoRepository.findById(id).orElse(null);

        if (producto != null) {

            producto.setNombreProducto(productoActualizado.getNombreProducto());
            producto.setDescripcion(productoActualizado.getDescripcion());
            producto.setPrecio(productoActualizado.getPrecio());
            producto.setStock(productoActualizado.getStock());
            producto.setCategoria(productoActualizado.getCategoria());
            producto.setTalla(productoActualizado.getTalla());
            producto.setCodigo(productoActualizado.getCodigo());
            producto.setImagen(productoActualizado.getImagen());

            return productoRepository.save(producto);
        }

        return null;
    }

    public void eliminarProducto(Long id) {
        productoRepository.deleteById(id);
    }

    public Producto descontarStock(Long id, Integer cantidad) {

        if (cantidad == null || cantidad <= 0) {
            throw new StockInsuficienteException("La cantidad debe ser mayor a 0");
        }

        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new StockInsuficienteException("No existe el producto con id " + id));

        if (producto.getStock() < cantidad) {
            throw new StockInsuficienteException(
                    "Stock insuficiente para " + producto.getNombreProducto() +
                            ". Disponible: " + producto.getStock());
        }

        producto.setStock(producto.getStock() - cantidad);

        return productoRepository.save(producto);
    }
}