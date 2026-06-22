package com.clothesrecovery.envio.controller;

import com.clothesrecovery.envio.model.Envio;
import com.clothesrecovery.envio.service.EnvioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/envios")
@Tag(name = "Envíos", description = "Operaciones relacionadas con los envíos")
public class EnvioController {

    @Autowired
    private EnvioService envioService;

    @Operation(summary = "Listar todos los envíos")
    @GetMapping
    public ResponseEntity<List<Envio>> listarEnvios() {
        return ResponseEntity.ok(envioService.listarEnvios());
    }

    @Operation(summary = "Buscar un envío por ID")
    @GetMapping("/{id}")
    public ResponseEntity<Envio> buscarEnvio(@PathVariable Long id) {

        Envio envio = envioService.buscarEnvioPorId(id);

        if (envio != null) {
            return ResponseEntity.ok(envio);
        }

        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Guardar un nuevo envío")
    @PostMapping
    public ResponseEntity<Envio> guardarEnvio(@Valid @RequestBody Envio envio) {
        return ResponseEntity.ok(envioService.guardarEnvio(envio));
    }

    @Operation(summary = "Actualizar un envío")
    @PutMapping("/{id}")
    public ResponseEntity<Envio> actualizarEnvio(
            @PathVariable Long id,
            @Valid @RequestBody Envio envio) {

        Envio envioActualizado =
                envioService.actualizarEnvio(id, envio);

        if (envioActualizado != null) {
            return ResponseEntity.ok(envioActualizado);
        }

        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Eliminar un envío")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarEnvio(@PathVariable Long id) {

        envioService.eliminarEnvio(id);

        return ResponseEntity.noContent().build();
    }
}