package com.clothesrecovery.envio.controller;

import com.clothesrecovery.envio.model.Envio;
import com.clothesrecovery.envio.service.EnvioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/envios")
public class EnvioController {

    @Autowired
    private EnvioService envioService;

    @GetMapping
    public ResponseEntity<List<Envio>> listarEnvios() {
        return ResponseEntity.ok(envioService.listarEnvios());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Envio> buscarEnvio(@PathVariable Long id) {

        Envio envio = envioService.buscarEnvioPorId(id);

        if (envio != null) {
            return ResponseEntity.ok(envio);
        }

        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Envio> guardarEnvio(@RequestBody Envio envio) {
        return ResponseEntity.ok(envioService.guardarEnvio(envio));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Envio> actualizarEnvio(
            @PathVariable Long id,
            @RequestBody Envio envio) {

        Envio envioActualizado =
                envioService.actualizarEnvio(id, envio);

        if (envioActualizado != null) {
            return ResponseEntity.ok(envioActualizado);
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarEnvio(@PathVariable Long id) {

        envioService.eliminarEnvio(id);

        return ResponseEntity.noContent().build();
    }
}