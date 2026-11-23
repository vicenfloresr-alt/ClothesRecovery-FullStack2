package com.clothesrecovery.catalogo.controller;

import com.clothesrecovery.catalogo.model.Producto;
import com.clothesrecovery.catalogo.service.ProductoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@Tag(name = "Productos", description = "Operaciones relacionadas con el catálogo de productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @Operation(summary = "Listar todos los productos")
    @GetMapping
    public ResponseEntity<List<Producto>> listarProductos() {
        return ResponseEntity.ok(productoService.listarProductos());
    }

    @Operation(summary = "Buscar un producto por ID")
    @GetMapping("/{id}")
    public ResponseEntity<Producto> buscarProducto(@PathVariable Long id) {

        Producto producto = productoService.buscarProductoPorId(id);

        if (producto != null) {
            return ResponseEntity.ok(producto);
        }

        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Guardar un nuevo producto")
    @PostMapping
    public ResponseEntity<Producto> guardarProducto(@Valid @RequestBody Producto producto) {
        return ResponseEntity.ok(productoService.guardarProducto(producto));
    }

    @Operation(summary = "Actualizar un producto")
    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizarProducto(
            @PathVariable Long id,
            @Valid @RequestBody Producto producto) {

        Producto productoActualizado =
                productoService.actualizarProducto(id, producto);

        if (productoActualizado != null) {
            return ResponseEntity.ok(productoActualizado);
        }

        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Eliminar un producto")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {

        productoService.eliminarProducto(id);

        return ResponseEntity.noContent().build();
    }
}