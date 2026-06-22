package com.clothesrecovery.inventario.controller;

import com.clothesrecovery.inventario.model.Inventario;
import com.clothesrecovery.inventario.service.InventarioService;
import com.clothesrecovery.inventario.service.StockInsuficienteException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventario")
public class InventarioController {

    @Autowired
    private InventarioService inventarioService;

    @GetMapping
    public ResponseEntity<List<Inventario>> listarInventario() {
        return ResponseEntity.ok(inventarioService.listarInventario());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inventario> buscarPorId(@PathVariable Long id) {

        Inventario inventario = inventarioService.buscarPorId(id);

        if (inventario != null) {
            return ResponseEntity.ok(inventario);
        }

        return ResponseEntity.notFound().build();
    }

    @GetMapping("/producto/{productoId}")
    public ResponseEntity<Inventario> buscarPorProducto(@PathVariable Long productoId) {

        Inventario inventario = inventarioService.buscarPorProductoId(productoId);

        if (inventario != null) {
            return ResponseEntity.ok(inventario);
        }

        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Inventario> guardarInventario(@RequestBody Inventario inventario) {
        return ResponseEntity.ok(inventarioService.guardarInventario(inventario));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Inventario> actualizarInventario(
            @PathVariable Long id,
            @RequestBody Inventario inventario) {

        Inventario inventarioActualizado =
                inventarioService.actualizarInventario(id, inventario);

        if (inventarioActualizado != null) {
            return ResponseEntity.ok(inventarioActualizado);
        }

        return ResponseEntity.notFound().build();
    }

    // Regla de negocio: descontar stock (ej. al confirmar un pedido)
    @PutMapping("/descontar")
    public ResponseEntity<?> descontarStock(@RequestBody Map<String, Integer> body) {

        try {
            Long productoId = body.get("productoId").longValue();
            Integer cantidad = body.get("cantidad");

            Inventario inventario = inventarioService.descontarStock(productoId, cantidad);
            return ResponseEntity.ok(inventario);

        } catch (StockInsuficienteException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Reponer stock (entrada de mercadería)
    @PutMapping("/reponer")
    public ResponseEntity<?> reponerStock(@RequestBody Map<String, Integer> body) {

        try {
            Long productoId = body.get("productoId").longValue();
            Integer cantidad = body.get("cantidad");

            Inventario inventario = inventarioService.reponerStock(productoId, cantidad);
            return ResponseEntity.ok(inventario);

        } catch (StockInsuficienteException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarInventario(@PathVariable Long id) {
        inventarioService.eliminarInventario(id);
        return ResponseEntity.noContent().build();
    }
}