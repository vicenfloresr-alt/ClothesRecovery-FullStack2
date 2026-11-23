package com.clothesrecovery.envio.repository;

import com.clothesrecovery.envio.model.Envio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnvioRepository extends JpaRepository<Envio, Long> {

}