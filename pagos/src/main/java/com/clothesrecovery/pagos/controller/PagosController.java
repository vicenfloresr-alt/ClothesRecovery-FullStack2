package com.clothesrecovery.pagos.controller;

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

import com.clothesrecovery.pagos.model.Pagos;
import com.clothesrecovery.pagos.service.PagosService;

@RestController
@RequestMapping("api/v1/pagos")
public class PagosController {
    @Autowired
    private PagosService pagosService;

    @GetMapping
    public ResponseEntity<List<Pagos>> listar(){
        List<Pagos> pagos = pagosService.listarPagos();

        if(pagos.isEmpty()){
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(pagos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pagos> buscar (@PathVariable Long id){
        try {
            Pagos pagos = pagosService.buscarPagoporId(id);
            return ResponseEntity.ok(pagos);
            
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Pagos> guardar(@RequestBody Pagos pagos){
        Pagos pagoNuevo = pagosService.guardarPagos(pagos);
        return ResponseEntity.ok(pagoNuevo);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Pagos> actualizar(@PathVariable Long id, @RequestBody Pagos pago){
        try {
            Pagos actualizarPago = pagosService.actualizarPagos(id, pago);
            return ResponseEntity.ok(actualizarPago);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelar(@PathVariable Long id){
        try{
            pagosService.cancelarPagos(id);
            return ResponseEntity.ok().build();
        } catch (Exception e){
            return ResponseEntity.notFound().build();
        }
        }
}
    


