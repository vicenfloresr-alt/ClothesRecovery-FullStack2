package com.clothesrecovery.pagos.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clothesrecovery.pagos.model.Pagos;
import com.clothesrecovery.pagos.repository.PagosRepository;

@Service
public class PagosService {
   @Autowired
  private PagosRepository pagosRepository;
  

public List<Pagos> listarPagos(){
    return pagosRepository.findAll();
}
  public Pagos buscarPagoporId(Long id){
    return pagosRepository.findById(id).orElse(null);
  }

  public Pagos guardarPagos(Pagos pago){
    return pagosRepository.save(pago);
  }
  public Pagos actualizarPagos(Long id, Pagos pagoActualizado){
    Pagos pago = pagosRepository.findById(id).orElse(null);

    if (pago != null) {
        pago.setMetodoPago(pagoActualizado.getMetodoPago());
        pago.setPrecioPrenda(pagoActualizado.getPrecioPrenda());

        return pagosRepository.save(pago);
    }

    return null;
  }
  public void cancelarPagos(Long id){
    pagosRepository.deleteById(id);
  }
}
