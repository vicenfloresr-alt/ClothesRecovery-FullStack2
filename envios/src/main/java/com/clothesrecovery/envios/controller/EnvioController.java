package com.clothesrecovery.envios.controller;


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

import com.clothesrecovery.envios.model.Envios;
import com.clothesrecovery.envios.service.EnviosService;

@RestController
@RequestMapping("api/v1/envios")
public class EnvioController {
    @Autowired
    private EnviosService envioService;

    @GetMapping
    public ResponseEntity<List<Envios>> listar(){
        List<Envios> envios = envioService.listarEnvios();

        if(envios.isEmpty()){
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(envios);
        
    }

    @GetMapping("/{id}")
    public ResponseEntity<Envios> buscar(@PathVariable Long id){
        try {
            Envios envio = envioService.buscarEnvioPorId(id);
            return ResponseEntity.ok(envio);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Envios> guardar(@RequestBody Envios envio){
        Envios envioNuevo = envioService.guardarEnvios(envio);
        return ResponseEntity.ok(envioNuevo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Envios> actualizar(@PathVariable Long id, @RequestBody Envios envio){
        try {
            Envios actualizarEnvio = envioService.actualizarEnvios(id,envio);
            
            return ResponseEntity.ok(actualizarEnvio);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id){
        try {
            envioService.eliminarEnvios(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    


}
