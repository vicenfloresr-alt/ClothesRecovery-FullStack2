package com.clothesrecovery.pedidos.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clothesrecovery.pedidos.model.Pedidos;
import com.clothesrecovery.pedidos.service.PedidoService;

@RestController
@RequestMapping("api/v1/pedidos")
public class PedidosController {

    @Autowired
    private PedidoService pedidoService;

    @GetMapping
    public ResponseEntity<List<Pedidos>> listar() {

        List<Pedidos> pedidos = pedidoService.listarPedidos();

        if (pedidos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedidos> buscar(@PathVariable Long id) {

        try {

            Pedidos pedido = pedidoService.buscarPedidoPorId(id);

            return ResponseEntity.ok(pedido);

        } catch (Exception e) {

            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Pedidos> guardar(@RequestBody Pedidos pedido) {

        Pedidos pedidoNuevo = pedidoService.guardarPedido(pedido);

        return ResponseEntity.ok(pedidoNuevo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pedidos> actualizar(@PathVariable Long id, @RequestBody Pedidos pedido) {

        try {

            Pedidos pedidoBuscado = pedidoService.buscarPedidoPorId(id);

            pedidoBuscado.setFecha(pedido.getFecha());
            pedidoBuscado.setEstado(pedido.getEstado());
            pedidoBuscado.setTotal(pedido.getTotal());
            pedidoBuscado.setClienteId(pedido.getClienteId());

            pedidoService.guardarPedido(pedidoBuscado);

            return ResponseEntity.ok(pedidoBuscado);

        } catch (Exception e) {

            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {

        try {

            pedidoService.eliminarPedido(id);

            return ResponseEntity.ok().build();

        } catch (Exception e) {

            return ResponseEntity.notFound().build();
        }
    }

}
