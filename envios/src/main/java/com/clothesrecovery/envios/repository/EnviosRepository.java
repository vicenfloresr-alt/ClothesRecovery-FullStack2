package com.clothesrecovery.envios.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.clothesrecovery.envios.model.Envios;

@Repository
public interface EnviosRepository extends JpaRepository<Envios, Long> {

}
