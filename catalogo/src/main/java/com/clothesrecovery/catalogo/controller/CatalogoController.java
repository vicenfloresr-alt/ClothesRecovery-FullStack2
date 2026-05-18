package com.clothesrecovery.catalogo.controller;

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

import com.clothesrecovery.catalogo.model.Catalogo;
import com.clothesrecovery.catalogo.service.CatalogoService;

@RestController
@RequestMapping("api/v1/catalogo")

public class CatalogoController {

    @Autowired
    private CatalogoService catalogoService;

    @GetMapping
    public ResponseEntity<List<Catalogo>> listar() {
    List<Catalogo> catalogos = catalogoService.listar();
    return ResponseEntity.ok(catalogos);
     }
    @PostMapping
    public ResponseEntity<Catalogo> guardar(@RequestBody Catalogo catalogo) {

        Catalogo nuevoCatalogo = catalogoService.guardar(catalogo);

        return ResponseEntity.ok(nuevoCatalogo);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Catalogo> buscar(@PathVariable Long id) {

        Catalogo catalogo = catalogoService.buscar(id);

        return ResponseEntity.ok(catalogo);
    }

    @PutMapping
    public ResponseEntity<Catalogo> actualizar(@RequestBody Catalogo catalogo) {

        Catalogo catalogoActualizado = catalogoService.actualizar(catalogo);

        return ResponseEntity.ok(catalogoActualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {

        catalogoService.eliminar(id);

        return ResponseEntity.ok("Catalogo eliminado");
    }
}