package com.clothesrecovery.pago.service;

import com.clothesrecovery.pago.model.Pago;
import com.clothesrecovery.pago.repository.PagoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PagoService {

    @Autowired
    private PagoRepository pagoRepository;

    public List<Pago> listarPagos() {
        return pagoRepository.findAll();
    }

    public Pago buscarPagoPorId(Long id) {
        return pagoRepository.findById(id).orElse(null);
    }

    public Pago guardarPago(Pago pago) {
        return pagoRepository.save(pago);
    }

    public Pago actualizarPago(Long id, Pago pagoActualizado) {

        Pago pago = pagoRepository.findById(id).orElse(null);

        if (pago != null) {

            pago.setPedidoId(pagoActualizado.getPedidoId());
            pago.setMetodoPago(pagoActualizado.getMetodoPago());
            pago.setMonto(pagoActualizado.getMonto());
            pago.setEstadoPago(pagoActualizado.getEstadoPago());
            pago.setFechaPago(pagoActualizado.getFechaPago());

            return pagoRepository.save(pago);
        }

        return null;
    }

    public void eliminarPago(Long id) {
        pagoRepository.deleteById(id);
    }
}