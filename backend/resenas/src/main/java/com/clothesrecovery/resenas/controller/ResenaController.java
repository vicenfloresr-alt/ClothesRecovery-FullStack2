package com.clothesrecovery.resenas.controller;

import com.clothesrecovery.resenas.model.Resena;
import com.clothesrecovery.resenas.service.ResenaDuplicadaException;
import com.clothesrecovery.resenas.service.ResenaService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resenas")
@Tag(name = "Reseñas", description = "Operaciones relacionadas con las reseñas de productos")
public class ResenaController {

    @Autowired
    private ResenaService resenaService;

    @Operation(summary = "Listar todas las reseñas")
    @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente")
    @GetMapping
    public ResponseEntity<List<Resena>> listarResenas() {
        return ResponseEntity.ok(resenaService.listarResenas());
    }

    @Operation(summary = "Buscar una reseña por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Reseña encontrada",
                    content = @Content(schema = @Schema(implementation = Resena.class))),
            @ApiResponse(responseCode = "404", description = "Reseña no encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Resena> buscarPorId(
            @Parameter(description = "ID de la reseña") @PathVariable Long id) {

        Resena resena = resenaService.buscarPorId(id);

        if (resena != null) {
            return ResponseEntity.ok(resena);
        }

        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Buscar reseñas por producto")
    @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente")
    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<Resena>> buscarPorProducto(
            @Parameter(description = "ID del producto") @PathVariable Long productoId) {

        return ResponseEntity.ok(resenaService.buscarPorProducto(productoId));
    }

    @Operation(summary = "Crear una nueva reseña")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Reseña creada correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o reseña duplicada")
    })
    @PostMapping
    public ResponseEntity<?> crearResena(@Valid @RequestBody Resena resena) {

        try {
            return ResponseEntity.ok(resenaService.crearResena(resena));

        } catch (ResenaDuplicadaException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @Operation(summary = "Actualizar una reseña")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Reseña actualizada"),
            @ApiResponse(responseCode = "404", description = "Reseña no encontrada")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Resena> actualizarResena(
            @Parameter(description = "ID de la reseña") @PathVariable Long id,
            @Valid @RequestBody Resena resena) {

        Resena resenaActualizada = resenaService.actualizarResena(id, resena);

        if (resenaActualizada != null) {
            return ResponseEntity.ok(resenaActualizada);
        }

        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Eliminar una reseña")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Reseña eliminada"),
            @ApiResponse(responseCode = "404", description = "Reseña no encontrada")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarResena(
            @Parameter(description = "ID de la reseña") @PathVariable Long id) {

        resenaService.eliminarResena(id);
        return ResponseEntity.noContent().build();
    }
}