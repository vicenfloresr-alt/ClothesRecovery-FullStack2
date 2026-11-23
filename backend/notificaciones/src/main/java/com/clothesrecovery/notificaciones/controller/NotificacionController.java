package com.clothesrecovery.notificaciones.controller;

import com.clothesrecovery.notificaciones.model.Notificacion;
import com.clothesrecovery.notificaciones.service.NotificacionInvalidaException;
import com.clothesrecovery.notificaciones.service.NotificacionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notificaciones")
@Tag(name = "Notificaciones", description = "Operaciones relacionadas con las notificaciones")
public class NotificacionController {

    @Autowired
    private NotificacionService notificacionService;

    @Operation(summary = "Listar todas las notificaciones")
    @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente")
    @GetMapping
    public ResponseEntity<List<Notificacion>> listarNotificaciones() {
        return ResponseEntity.ok(notificacionService.listarNotificaciones());
    }

    @Operation(summary = "Buscar una notificación por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Notificación encontrada",
                    content = @Content(schema = @Schema(implementation = Notificacion.class))),
            @ApiResponse(responseCode = "404", description = "Notificación no encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Notificacion> buscarPorId(
            @Parameter(description = "ID de la notificación") @PathVariable Long id) {

        Notificacion notificacion = notificacionService.buscarPorId(id);

        if (notificacion != null) {
            return ResponseEntity.ok(notificacion);
        }

        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Buscar notificaciones por destinatario")
    @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente")
    @GetMapping("/destinatario/{destinatarioId}")
    public ResponseEntity<List<Notificacion>> buscarPorDestinatario(
            @Parameter(description = "ID del destinatario") @PathVariable Long destinatarioId) {

        return ResponseEntity.ok(
                notificacionService.buscarPorDestinatario(destinatarioId));
    }

    @Operation(summary = "Buscar notificaciones no leídas por destinatario")
    @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente")
    @GetMapping("/destinatario/{destinatarioId}/no-leidas")
    public ResponseEntity<List<Notificacion>> buscarNoLeidas(
            @Parameter(description = "ID del destinatario") @PathVariable Long destinatarioId) {

        return ResponseEntity.ok(
                notificacionService.buscarNoLeidas(destinatarioId));
    }

    @Operation(summary = "Crear una nueva notificación")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Notificación creada correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PostMapping
    public ResponseEntity<Notificacion> crearNotificacion(
            @Valid @RequestBody Notificacion notificacion) {

        return ResponseEntity.ok(
                notificacionService.crearNotificacion(notificacion));
    }

    @Operation(summary = "Marcar una notificación como leída")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Notificación actualizada"),
            @ApiResponse(responseCode = "400", description = "La notificación no pudo actualizarse")
    })
    @PutMapping("/{id}/leida")
    public ResponseEntity<?> marcarComoLeida(
            @Parameter(description = "ID de la notificación") @PathVariable Long id) {

        try {
            return ResponseEntity.ok(
                    notificacionService.marcarComoLeida(id));

        } catch (NotificacionInvalidaException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @Operation(summary = "Eliminar una notificación")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Notificación eliminada"),
            @ApiResponse(responseCode = "404", description = "Notificación no encontrada")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarNotificacion(
            @Parameter(description = "ID de la notificación") @PathVariable Long id) {

        notificacionService.eliminarNotificacion(id);
        return ResponseEntity.noContent().build();
    }
}