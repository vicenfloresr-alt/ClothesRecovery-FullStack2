package com.clothesrecovery.resenas.controller;

import com.clothesrecovery.resenas.model.Resena;
import com.clothesrecovery.resenas.service.ResenaService;
import com.clothesrecovery.resenas.service.ResenaDuplicadaException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resenas")
public class ResenaController {

    @Autowired
    private ResenaService resenaService;

    @GetMapping
    public ResponseEntity<List<Resena>> listarResenas() {
        return ResponseEntity.ok(resenaService.listarResenas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resena> buscarPorId(@PathVariable Long id) {

        Resena resena = resenaService.buscarPorId(id);

        if (resena != null) {
            return ResponseEntity.ok(resena);
        }

        return ResponseEntity.notFound().build();
    }

    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<Resena>> buscarPorProducto(@PathVariable Long productoId) {
        return ResponseEntity.ok(resenaService.buscarPorProducto(productoId));
    }

    @PostMapping
    public ResponseEntity<?> crearResena(@RequestBody Resena resena) {

        try {
            return ResponseEntity.ok(resenaService.crearResena(resena));

        } catch (ResenaDuplicadaException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resena> actualizarResena(
            @PathVariable Long id,
            @RequestBody Resena resena) {

        Resena resenaActualizada = resenaService.actualizarResena(id, resena);

        if (resenaActualizada != null) {
            return ResponseEntity.ok(resenaActualizada);
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarResena(@PathVariable Long id) {
        resenaService.eliminarResena(id);
        return ResponseEntity.noContent().build();
    }
}