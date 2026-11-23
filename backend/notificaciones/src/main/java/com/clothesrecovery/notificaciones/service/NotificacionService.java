package com.clothesrecovery.notificaciones.service;

import com.clothesrecovery.notificaciones.model.Notificacion;
import com.clothesrecovery.notificaciones.repository.NotificacionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificacionService {

    @Autowired
    private NotificacionRepository notificacionRepository;

    public List<Notificacion> listarNotificaciones() {
        return notificacionRepository.findAll();
    }

    public Notificacion buscarPorId(Long id) {
        return notificacionRepository.findById(id).orElse(null);
    }

    public List<Notificacion> buscarPorDestinatario(Long destinatarioId) {
        return notificacionRepository.findByDestinatarioId(destinatarioId);
    }

    public List<Notificacion> buscarNoLeidas(Long destinatarioId) {
        return notificacionRepository.findByDestinatarioIdAndLeida(destinatarioId, false);
    }

    public Notificacion crearNotificacion(Notificacion notificacion) {
        notificacion.setFecha(LocalDateTime.now());
        notificacion.setLeida(false);
        return notificacionRepository.save(notificacion);
    }

    public Notificacion marcarComoLeida(Long id) {

        Notificacion notificacion = notificacionRepository.findById(id)
                .orElseThrow(() -> new NotificacionInvalidaException(
                        "No existe la notificación con id " + id));

        if (notificacion.getLeida()) {
            throw new NotificacionInvalidaException(
                    "La notificación con id " + id + " ya fue marcada como leída");
        }

        notificacion.setLeida(true);

        return notificacionRepository.save(notificacion);
    }

    public void eliminarNotificacion(Long id) {
        notificacionRepository.deleteById(id);
    }
}