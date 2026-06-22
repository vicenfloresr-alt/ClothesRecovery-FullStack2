package com.clothesrecovery.pago.controller;

import com.clothesrecovery.pago.model.Pago;
import com.clothesrecovery.pago.service.PagoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pagos")
public class PagoController {

    @Autowired
    private PagoService pagoService;

    @GetMapping
    public ResponseEntity<List<Pago>> listarPagos() {
        return ResponseEntity.ok(pagoService.listarPagos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pago> buscarPago(@PathVariable Long id) {

        Pago pago = pagoService.buscarPagoPorId(id);

        if (pago != null) {
            return ResponseEntity.ok(pago);
        }

        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Pago> guardarPago(@RequestBody Pago pago) {
        return ResponseEntity.ok(pagoService.guardarPago(pago));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pago> actualizarPago(
            @PathVariable Long id,
            @RequestBody Pago pago) {

        Pago pagoActualizado =
                pagoService.actualizarPago(id, pago);

        if (pagoActualizado != null) {
            return ResponseEntity.ok(pagoActualizado);
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPago(@PathVariable Long id) {

        pagoService.eliminarPago(id);

        return ResponseEntity.noContent().build();
    }
}