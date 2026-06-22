package com.clothesrecovery.pedido.controller;

import com.clothesrecovery.pedido.model.Pedido;
import com.clothesrecovery.pedido.service.PedidoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @GetMapping
    public ResponseEntity<List<Pedido>> listarPedidos() {
        return ResponseEntity.ok(pedidoService.listarPedidos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> buscarPedido(@PathVariable Long id) {

        Pedido pedido = pedidoService.buscarPedidoPorId(id);

        if (pedido != null) {
            return ResponseEntity.ok(pedido);
        }

        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Pedido> guardarPedido(@RequestBody Pedido pedido) {
        return ResponseEntity.ok(pedidoService.guardarPedido(pedido));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pedido> actualizarPedido(
            @PathVariable Long id,
            @RequestBody Pedido pedido) {

        Pedido pedidoActualizado =
                pedidoService.actualizarPedido(id, pedido);

        if (pedidoActualizado != null) {
            return ResponseEntity.ok(pedidoActualizado);
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPedido(@PathVariable Long id) {

        pedidoService.eliminarPedido(id);

        return ResponseEntity.noContent().build();
    }
}