package com.clothesrecovery.catalogo.repository;

import com.clothesrecovery.catalogo.model.Producto;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

}