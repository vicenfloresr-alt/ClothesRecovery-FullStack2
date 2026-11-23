package com.clothesrecovery.pedido.controller;

import com.clothesrecovery.pedido.model.Pedido;
import com.clothesrecovery.pedido.service.PedidoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@Tag(name = "Pedidos", description = "Operaciones relacionadas con los pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @Operation(summary = "Listar todos los pedidos")
    @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente")
    @GetMapping
    public ResponseEntity<List<Pedido>> listarPedidos() {
        return ResponseEntity.ok(pedidoService.listarPedidos());
    }

    @Operation(summary = "Buscar un pedido por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Pedido encontrado",
                    content = @Content(schema = @Schema(implementation = Pedido.class))),
            @ApiResponse(responseCode = "404", description = "Pedido no encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Pedido> buscarPedido(
            @Parameter(description = "ID del pedido") @PathVariable Long id) {

        Pedido pedido = pedidoService.buscarPedidoPorId(id);

        if (pedido != null) {
            return ResponseEntity.ok(pedido);
        }

        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Crear un nuevo pedido")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Pedido creado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PostMapping
    public ResponseEntity<Pedido> guardarPedido(
            @Valid @RequestBody Pedido pedido) {

        return ResponseEntity.ok(pedidoService.guardarPedido(pedido));
    }

    @Operation(summary = "Actualizar un pedido")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Pedido actualizado"),
            @ApiResponse(responseCode = "404", description = "Pedido no encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Pedido> actualizarPedido(
            @Parameter(description = "ID del pedido") @PathVariable Long id,
            @Valid @RequestBody Pedido pedido) {

        Pedido pedidoActualizado =
                pedidoService.actualizarPedido(id, pedido);

        if (pedidoActualizado != null) {
            return ResponseEntity.ok(pedidoActualizado);
        }

        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Eliminar un pedido")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Pedido eliminado"),
            @ApiResponse(responseCode = "404", description = "Pedido no encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPedido(
            @Parameter(description = "ID del pedido") @PathVariable Long id) {

        pedidoService.eliminarPedido(id);

        return ResponseEntity.noContent().build();
    }
}