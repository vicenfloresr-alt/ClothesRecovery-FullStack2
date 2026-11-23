package com.clothesrecovery.devoluciones.controller;

import com.clothesrecovery.devoluciones.model.Devolucion;
import com.clothesrecovery.devoluciones.service.DevolucionService;
import com.clothesrecovery.devoluciones.service.EstadoInvalidoException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/devoluciones")
@Tag(name = "Devoluciones", description = "Operaciones relacionadas con las devoluciones")
public class DevolucionController {

    private final DevolucionService devolucionService;

    public DevolucionController(DevolucionService devolucionService) {
        this.devolucionService = devolucionService;
    }

    @Operation(summary = "Listar todas las devoluciones")
    @GetMapping
    public ResponseEntity<List<Devolucion>> listarDevoluciones() {
        return ResponseEntity.ok(devolucionService.listarDevoluciones());
    }

    @Operation(summary = "Buscar una devolución por ID")
    @GetMapping("/{id}")
    public ResponseEntity<Devolucion> buscarPorId(@PathVariable Long id) {

        Devolucion devolucion = devolucionService.buscarPorId(id);

        if (devolucion != null) {
            return ResponseEntity.ok(devolucion);
        }

        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Buscar devoluciones por cliente")
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Devolucion>> buscarPorCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(devolucionService.buscarPorCliente(clienteId));
    }

    @Operation(summary = "Crear una nueva devolución")
    @PostMapping
    public ResponseEntity<Devolucion> crearDevolucion(@Valid @RequestBody Devolucion devolucion) {
        return ResponseEntity.ok(devolucionService.crearDevolucion(devolucion));
    }

    @Operation(summary = "Actualizar el estado de una devolución")
    @PutMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        try {

            Devolucion devolucion =
                    devolucionService.actualizarEstado(id, body.get("estado"));

            return ResponseEntity.ok(devolucion);

        } catch (EstadoInvalidoException e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @Operation(summary = "Eliminar una devolución")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarDevolucion(@PathVariable Long id) {
        devolucionService.eliminarDevolucion(id);
        return ResponseEntity.noContent().build();
    }

}