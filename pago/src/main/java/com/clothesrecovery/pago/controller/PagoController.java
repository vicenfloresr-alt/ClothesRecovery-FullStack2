package com.clothesrecovery.pago.controller;

import com.clothesrecovery.pago.model.Pago;
import com.clothesrecovery.pago.service.PagoService;

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
@RequestMapping("/api/pagos")
@Tag(name = "Pagos", description = "Operaciones relacionadas con los pagos")
public class PagoController {

    @Autowired
    private PagoService pagoService;

    @Operation(summary = "Listar todos los pagos")
    @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente")
    @GetMapping
    public ResponseEntity<List<Pago>> listarPagos() {
        return ResponseEntity.ok(pagoService.listarPagos());
    }

    @Operation(summary = "Buscar un pago por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Pago encontrado",
                    content = @Content(schema = @Schema(implementation = Pago.class))),
            @ApiResponse(responseCode = "404", description = "Pago no encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Pago> buscarPago(
            @Parameter(description = "ID del pago") @PathVariable Long id) {

        Pago pago = pagoService.buscarPagoPorId(id);

        if (pago != null) {
            return ResponseEntity.ok(pago);
        }

        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Crear un nuevo pago")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Pago creado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PostMapping
    public ResponseEntity<Pago> guardarPago(
            @Valid @RequestBody Pago pago) {

        return ResponseEntity.ok(pagoService.guardarPago(pago));
    }

    @Operation(summary = "Actualizar un pago")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Pago actualizado"),
            @ApiResponse(responseCode = "404", description = "Pago no encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Pago> actualizarPago(
            @Parameter(description = "ID del pago") @PathVariable Long id,
            @Valid @RequestBody Pago pago) {

        Pago pagoActualizado =
                pagoService.actualizarPago(id, pago);

        if (pagoActualizado != null) {
            return ResponseEntity.ok(pagoActualizado);
        }

        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Eliminar un pago")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Pago eliminado"),
            @ApiResponse(responseCode = "404", description = "Pago no encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPago(
            @Parameter(description = "ID del pago") @PathVariable Long id) {

        pagoService.eliminarPago(id);

        return ResponseEntity.noContent().build();
    }
}