package com.clothesrecovery.devoluciones.controller;

import com.clothesrecovery.devoluciones.model.Devolucion;
import com.clothesrecovery.devoluciones.service.DevolucionService;
import com.clothesrecovery.devoluciones.service.EstadoInvalidoException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/devoluciones")
public class DevolucionController {

    @Autowired
    private DevolucionService devolucionService;

    @GetMapping
    public ResponseEntity<List<Devolucion>> listarDevoluciones() {
        return ResponseEntity.ok(devolucionService.listarDevoluciones());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Devolucion> buscarPorId(@PathVariable Long id) {

        Devolucion devolucion = devolucionService.buscarPorId(id);

        if (devolucion != null) {
            return ResponseEntity.ok(devolucion);
        }

        return ResponseEntity.notFound().build();
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Devolucion>> buscarPorCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(devolucionService.buscarPorCliente(clienteId));
    }

    @PostMapping
    public ResponseEntity<Devolucion> crearDevolucion(@RequestBody Devolucion devolucion) {
        return ResponseEntity.ok(devolucionService.crearDevolucion(devolucion));
    }

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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarDevolucion(@PathVariable Long id) {
        devolucionService.eliminarDevolucion(id);
        return ResponseEntity.noContent().build();
    }
}