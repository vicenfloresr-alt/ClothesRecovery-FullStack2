package com.clothesrecovery.devoluciones.service;

import com.clothesrecovery.devoluciones.model.Devolucion;
import com.clothesrecovery.devoluciones.repository.DevolucionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DevolucionService {

    @Autowired
    private DevolucionRepository devolucionRepository;

    public List<Devolucion> listarDevoluciones() {
        return devolucionRepository.findAll();
    }

    public Devolucion buscarPorId(Long id) {
        return devolucionRepository.findById(id).orElse(null);
    }

    public List<Devolucion> buscarPorCliente(Long clienteId) {
        return devolucionRepository.findByClienteId(clienteId);
    }

    public Devolucion crearDevolucion(Devolucion devolucion) {
        devolucion.setEstado("PENDIENTE");
        devolucion.setFechaSolicitud(LocalDateTime.now());
        return devolucionRepository.save(devolucion);
    }

    public Devolucion actualizarEstado(Long id, String nuevoEstado) {

        Devolucion devolucion = devolucionRepository.findById(id)
                .orElseThrow(() -> new EstadoInvalidoException(
                        "No existe la devolución con id " + id));

        if (!devolucion.getEstado().equals("PENDIENTE")) {
            throw new EstadoInvalidoException(
                    "La devolución ya fue resuelta con estado: " + devolucion.getEstado());
        }

        if (!nuevoEstado.equals("APROBADA") && !nuevoEstado.equals("RECHAZADA")) {
            throw new EstadoInvalidoException(
                    "Estado no válido: " + nuevoEstado);
        }

        devolucion.setEstado(nuevoEstado);

        return devolucionRepository.save(devolucion);
    }

    public void eliminarDevolucion(Long id) {
        devolucionRepository.deleteById(id);
    }
}