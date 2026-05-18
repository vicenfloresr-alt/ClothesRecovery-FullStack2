package com.clothesrecovery.catalogo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clothesrecovery.catalogo.model.Catalogo;
import com.clothesrecovery.catalogo.repository.CatalogoRepository;

@Service
public class CatalogoService {

    @Autowired
    private CatalogoRepository catalogoRepository;

    public List<Catalogo> listar() {
        return catalogoRepository.findAll();
    }

    public Catalogo guardar(Catalogo catalogo) {
        return catalogoRepository.save(catalogo);
    }

    public Catalogo buscar(Long id) {
        return catalogoRepository.findById(id).get();
    }

    public Catalogo actualizar(Catalogo catalogo) {
        return catalogoRepository.save(catalogo);
    }

    public void eliminar(Long id) {
        catalogoRepository.deleteById(id);
    }
}