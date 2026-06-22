package com.clothesrecovery.notificaciones.controller;

import com.clothesrecovery.notificaciones.model.Notificacion;
import com.clothesrecovery.notificaciones.service.NotificacionService;
import com.clothesrecovery.notificaciones.service.NotificacionInvalidaException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notificaciones")
public class NotificacionController {

    @Autowired
    private NotificacionService notificacionService;

    @GetMapping
    public ResponseEntity<List<Notificacion>> listarNotificaciones() {
        return ResponseEntity.ok(notificacionService.listarNotificaciones());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Notificacion> buscarPorId(@PathVariable Long id) {

        Notificacion notificacion = notificacionService.buscarPorId(id);

        if (notificacion != null) {
            return ResponseEntity.ok(notificacion);
        }

        return ResponseEntity.notFound().build();
    }

    @GetMapping("/destinatario/{destinatarioId}")
    public ResponseEntity<List<Notificacion>> buscarPorDestinatario(
            @PathVariable Long destinatarioId) {
        return ResponseEntity.ok(notificacionService.buscarPorDestinatario(destinatarioId));
    }

    @GetMapping("/destinatario/{destinatarioId}/no-leidas")
    public ResponseEntity<List<Notificacion>> buscarNoLeidas(
            @PathVariable Long destinatarioId) {
        return ResponseEntity.ok(notificacionService.buscarNoLeidas(destinatarioId));
    }

    @PostMapping
    public ResponseEntity<Notificacion> crearNotificacion(
            @RequestBody Notificacion notificacion) {
        return ResponseEntity.ok(notificacionService.crearNotificacion(notificacion));
    }

    @PutMapping("/{id}/leida")
    public ResponseEntity<?> marcarComoLeida(@PathVariable Long id) {

        try {
            return ResponseEntity.ok(notificacionService.marcarComoLeida(id));

        } catch (NotificacionInvalidaException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarNotificacion(@PathVariable Long id) {
        notificacionService.eliminarNotificacion(id);
        return ResponseEntity.noContent().build();
    }
}