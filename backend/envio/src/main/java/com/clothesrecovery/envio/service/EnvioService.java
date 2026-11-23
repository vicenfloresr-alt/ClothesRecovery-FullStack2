package com.clothesrecovery.envio.service;

import com.clothesrecovery.envio.model.Envio;
import com.clothesrecovery.envio.repository.EnvioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnvioService {

    @Autowired
    private EnvioRepository envioRepository;

    public List<Envio> listarEnvios() {
        return envioRepository.findAll();
    }

    public Envio buscarEnvioPorId(Long id) {
        return envioRepository.findById(id).orElse(null);
    }

    public Envio guardarEnvio(Envio envio) {
        return envioRepository.save(envio);
    }

    public Envio actualizarEnvio(Long id, Envio envioActualizado) {

        Envio envio = envioRepository.findById(id).orElse(null);

        if (envio != null) {

            envio.setPedidoId(envioActualizado.getPedidoId());
            envio.setDireccionEnvio(envioActualizado.getDireccionEnvio());
            envio.setCiudad(envioActualizado.getCiudad());
            envio.setEstadoEnvio(envioActualizado.getEstadoEnvio());
            envio.setFechaEnvio(envioActualizado.getFechaEnvio());

            return envioRepository.save(envio);
        }

        return null;
    }

    public void eliminarEnvio(Long id) {
        envioRepository.deleteById(id);
    }
}