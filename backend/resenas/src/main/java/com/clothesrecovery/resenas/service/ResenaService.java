package com.clothesrecovery.resenas.service;

import com.clothesrecovery.resenas.model.Resena;
import com.clothesrecovery.resenas.repository.ResenaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ResenaService {

    @Autowired
    private ResenaRepository resenaRepository;

    public List<Resena> listarResenas() {
        return resenaRepository.findAll();
    }

    public Resena buscarPorId(Long id) {
        return resenaRepository.findById(id).orElse(null);
    }

    public List<Resena> buscarPorProducto(Long productoId) {
        return resenaRepository.findByProductoId(productoId);
    }

    public Resena crearResena(Resena resena) {

        resenaRepository.findByClienteIdAndProductoId(
                resena.getClienteId(), resena.getProductoId())
                .ifPresent(r -> {
                    throw new ResenaDuplicadaException(
                            "El cliente " + resena.getClienteId() +
                                    " ya realizó una reseña para el producto " +
                                    resena.getProductoId());
                });

        resena.setFecha(LocalDateTime.now());

        return resenaRepository.save(resena);
    }

    public Resena actualizarResena(Long id, Resena resenaActualizada) {

        Resena resena = resenaRepository.findById(id).orElse(null);

        if (resena != null) {

            resena.setCalificacion(resenaActualizada.getCalificacion());
            resena.setComentario(resenaActualizada.getComentario());

            return resenaRepository.save(resena);
        }

        return null;
    }

    public void eliminarResena(Long id) {
        resenaRepository.deleteById(id);
    }
}