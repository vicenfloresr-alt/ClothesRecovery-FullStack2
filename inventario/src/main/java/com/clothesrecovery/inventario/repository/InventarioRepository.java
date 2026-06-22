package com.clothesrecovery.inventario.repository;

import com.clothesrecovery.inventario.model.Inventario;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InventarioRepository extends JpaRepository<Inventario, Long> {

    Optional<Inventario> findByProductoId(Long productoId);

}