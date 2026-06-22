package com.clothesrecovery.devoluciones.repository;

import com.clothesrecovery.devoluciones.model.Devolucion;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DevolucionRepository extends JpaRepository<Devolucion, Long> {

    List<Devolucion> findByClienteId(Long clienteId);

    List<Devolucion> findByEstado(String estado);

}