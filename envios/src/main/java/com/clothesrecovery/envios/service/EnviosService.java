package com.clothesrecovery.envios.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clothesrecovery.envios.model.Envios;
import com.clothesrecovery.envios.repository.EnviosRepository;

@Service
public class EnviosService {
    @Autowired
    private EnviosRepository enviosRepository;


    public List<Envios> listarEnvios() {
        return enviosRepository.findAll();
    }

    public Envios buscarEnvioPorId(Long id) {
        return enviosRepository.findById(id).orElse(null);
    }

    public Envios guardarEnvios(Envios envio) {
        return enviosRepository.save(envio);
    }

    public Envios actualizarEnvios(Long id, Envios envioActualizado) {
        Envios envio = enviosRepository.findById(id).orElse(null);

        if (envio != null) {
            envio.setDireccion(envioActualizado.getDireccion());
            envio.setRegion(envioActualizado.getRegion());
            envio.setComuna(envioActualizado.getComuna());
            envio.setCiudad(envioActualizado.getCiudad());
            envio.setFechaEnvio(envioActualizado.getFechaEnvio());

            return enviosRepository.save(envio);
        }

        return null;
    }
    public void eliminarEnvios(Long id) {
        enviosRepository.deleteById(id);
    }
}

