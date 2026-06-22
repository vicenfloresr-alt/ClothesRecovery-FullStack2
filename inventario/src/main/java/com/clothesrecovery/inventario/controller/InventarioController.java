package com.clothesrecovery.inventario.controller;

import com.clothesrecovery.inventario.model.Inventario;
import com.clothesrecovery.inventario.service.InventarioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventario")
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
    public Inventario buscarPorId(@PathVariable Long id) {
        return inventarioService.buscarPorId(id);
    }

    @Operation(summary = "Buscar inventario por ID del producto")
    @GetMapping("/producto/{productoId}")
    public Inventario buscarPorProductoId(@PathVariable Long productoId) {
        return inventarioService.buscarPorProductoId(productoId);
    }

    @Operation(summary = "Guardar un nuevo registro de inventario")
    @PostMapping
    public Inventario guardarInventario(@Valid @RequestBody Inventario inventario) {
        return inventarioService.guardarInventario(inventario);
    }

    @Operation(summary = "Actualizar un registro de inventario")
    @PutMapping("/{id}")
    public Inventario actualizarInventario(
            @PathVariable Long id,
            @Valid @RequestBody Inventario inventario) {

        return inventarioService.actualizarInventario(id, inventario);
    }

    @Operation(summary = "Descontar stock de un producto")
    @PutMapping("/descontar/{productoId}/{cantidad}")
    public Inventario descontarStock(
            @PathVariable Long productoId,
            @PathVariable Integer cantidad) {

        return inventarioService.descontarStock(productoId, cantidad);
    }

    @Operation(summary = "Reponer stock de un producto")
    @PutMapping("/reponer/{productoId}/{cantidad}")
    public Inventario reponerStock(
            @PathVariable Long productoId,
            @PathVariable Integer cantidad) {

        return inventarioService.reponerStock(productoId, cantidad);
    }

    @Operation(summary = "Eliminar un registro de inventario")
    @DeleteMapping("/{id}")
    public void eliminarInventario(@PathVariable Long id) {
        inventarioService.eliminarInventario(id);
    }
}