package com.clothesrecovery.resenas.repository;

import com.clothesrecovery.resenas.model.Resena;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResenaRepository extends JpaRepository<Resena, Long> {

    List<Resena> findByProductoId(Long productoId);

    Optional<Resena> findByClienteIdAndProductoId(Long clienteId, Long productoId);

}