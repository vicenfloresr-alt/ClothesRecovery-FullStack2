package com.clothesrecovery.inventario.controller;

import com.clothesrecovery.inventario.model.Inventario;
import com.clothesrecovery.inventario.service.InventarioService;
import com.clothesrecovery.inventario.service.StockInsuficienteException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/inventario")
@Tag(name = "Inventario", description = "Operaciones relacionadas con el inventario")
public class InventarioController {

    @Autowired
    private InventarioService inventarioService;

    @Operation(summary = "Listar todo el inventario")
    @GetMapping
    public List<Inventario> listarInventario() {
        return inventarioService.listarInventario();
    }

    @Operation(summary = "Buscar inventario por ID")
    @GetMapping("/{id}")
    public ResponseEntity<Inventario> buscarPorId(@PathVariable Long id) {

        Inventario inventario = inventarioService.buscarPorId(id);

        if (inventario != null) {
            return ResponseEntity.ok(inventario);
        }

        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Buscar inventario por ID del producto")
    @GetMapping("/producto/{productoId}")
    public ResponseEntity<Inventario> buscarPorProductoId(@PathVariable Long productoId) {

        Inventario inventario = inventarioService.buscarPorProductoId(productoId);

        if (inventario != null) {
            return ResponseEntity.ok(inventario);
        }

        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Guardar un nuevo registro de inventario")
    @PostMapping
    public Inventario guardarInventario(@Valid @RequestBody Inventario inventario) {
        return inventarioService.guardarInventario(inventario);
    }

    @Operation(summary = "Actualizar un registro de inventario")
    @PutMapping("/{id}")
    public ResponseEntity<Inventario> actualizarInventario(
            @PathVariable Long id,
            @Valid @RequestBody Inventario inventario) {

        Inventario inventarioActualizado = inventarioService.actualizarInventario(id, inventario);

        if (inventarioActualizado != null) {
            return ResponseEntity.ok(inventarioActualizado);
        }

        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Descontar stock de un producto")
    @PutMapping("/descontar/{productoId}/{cantidad}")
    public ResponseEntity<?> descontarStock(
            @PathVariable Long productoId,
            @PathVariable Integer cantidad) {

        try {
            return ResponseEntity.ok(inventarioService.descontarStock(productoId, cantidad));

        } catch (StockInsuficienteException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @Operation(summary = "Reponer stock de un producto")
    @PutMapping("/reponer/{productoId}/{cantidad}")
    public ResponseEntity<?> reponerStock(
            @PathVariable Long productoId,
            @PathVariable Integer cantidad) {

        try {
            return ResponseEntity.ok(inventarioService.reponerStock(productoId, cantidad));

        } catch (StockInsuficienteException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @Operation(summary = "Eliminar un registro de inventario")
    @DeleteMapping("/{id}")
    public void eliminarInventario(@PathVariable Long id) {
        inventarioService.eliminarInventario(id);
    }
}