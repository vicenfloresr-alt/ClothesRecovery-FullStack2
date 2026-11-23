package com.clothesrecovery.inventario.service;

import com.clothesrecovery.inventario.model.Inventario;
import com.clothesrecovery.inventario.repository.InventarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventarioService {

    @Autowired
    private InventarioRepository inventarioRepository;

    public List<Inventario> listarInventario() {
        return inventarioRepository.findAll();
    }

    public Inventario buscarPorId(Long id) {
        return inventarioRepository.findById(id).orElse(null);
    }

    public Inventario buscarPorProductoId(Long productoId) {
        return inventarioRepository.findByProductoId(productoId).orElse(null);
    }

    public Inventario guardarInventario(Inventario inventario) {
        return inventarioRepository.save(inventario);
    }

    public Inventario actualizarInventario(Long id, Inventario inventarioActualizado) {

        Inventario inventario = inventarioRepository.findById(id).orElse(null);

        if (inventario != null) {

            inventario.setProductoId(inventarioActualizado.getProductoId());
            inventario.setCantidadDisponible(inventarioActualizado.getCantidadDisponible());
            inventario.setUbicacionBodega(inventarioActualizado.getUbicacionBodega());

            return inventarioRepository.save(inventario);
        }

        return null;
    }

    public Inventario descontarStock(Long productoId, Integer cantidad) {

        Inventario inventario = inventarioRepository.findByProductoId(productoId)
                .orElseThrow(() -> new StockInsuficienteException(
                        "No existe inventario registrado para el producto " + productoId));

        if (inventario.getCantidadDisponible() < cantidad) {
            throw new StockInsuficienteException(
                    "Stock insuficiente para el producto " + productoId +
                            ". Disponible: " + inventario.getCantidadDisponible());
        }

        inventario.setCantidadDisponible(inventario.getCantidadDisponible() - cantidad);

        return inventarioRepository.save(inventario);
    }

    public Inventario reponerStock(Long productoId, Integer cantidad) {

        Inventario inventario = inventarioRepository.findByProductoId(productoId)
                .orElseThrow(() -> new StockInsuficienteException(
                        "No existe inventario registrado para el producto " + productoId));

        inventario.setCantidadDisponible(inventario.getCantidadDisponible() + cantidad);

        return inventarioRepository.save(inventario);
    }

    public void eliminarInventario(Long id) {
        inventarioRepository.deleteById(id);
    }
}