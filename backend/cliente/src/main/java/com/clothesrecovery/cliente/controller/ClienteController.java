package com.clothesrecovery.cliente.controller;

import com.clothesrecovery.cliente.model.Cliente;
import com.clothesrecovery.cliente.service.ClienteService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@Tag(name = "Clientes", description = "Operaciones relacionadas con los clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @Operation(summary = "Listar todos los clientes")
    @GetMapping
    public ResponseEntity<List<Cliente>> listarClientes() {
        return ResponseEntity.ok(clienteService.listarClientes());
    }

    @Operation(summary = "Buscar un cliente por ID")
    @GetMapping("/{id}")
    public ResponseEntity<Cliente> buscarCliente(@PathVariable Long id) {

        Cliente cliente = clienteService.buscarClientePorId(id);

        if (cliente != null) {
            return ResponseEntity.ok(cliente);
        }

        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Guardar un nuevo cliente")
    @PostMapping
    public ResponseEntity<Cliente> guardarCliente(@Valid @RequestBody Cliente cliente) {
        return ResponseEntity.ok(clienteService.guardarCliente(cliente));
    }

    @Operation(summary = "Actualizar un cliente")
    @PutMapping("/{id}")
    public ResponseEntity<Cliente> actualizarCliente(
            @PathVariable Long id,
            @Valid @RequestBody Cliente cliente) {

        Cliente clienteActualizado = clienteService.actualizarCliente(id, cliente);

        if (clienteActualizado != null) {
            return ResponseEntity.ok(clienteActualizado);
        }

        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Eliminar un cliente")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCliente(@PathVariable Long id) {

        clienteService.eliminarCliente(id);

        return ResponseEntity.noContent().build();
    }

}