package com.clothesrecovery.pago;

import com.clothesrecovery.pago.model.Pago;
import com.clothesrecovery.pago.repository.PagoRepository;
import com.clothesrecovery.pago.service.PagoService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PagoServiceTest {

    @Mock
    private PagoRepository pagoRepository;

    @InjectMocks
    private PagoService pagoService;

    private Pago crearPago() {
        Pago p = new Pago();
        p.setId(1L);
        p.setPedidoId(3L);
        p.setMetodoPago("TARJETA");
        p.setMonto(25000.0);
        p.setEstadoPago("APROBADO");
        p.setFechaPago("2025-07-01");
        return p;
    }

    @Test
    void listarPagos_debeRetornarLista() {
        when(pagoRepository.findAll()).thenReturn(List.of(crearPago()));
        List<Pago> result = pagoService.listarPagos();
        assertFalse(result.isEmpty());
    }

    @Test
    void buscarPagoPorId_existente_debeRetornarPago() {
        when(pagoRepository.findById(1L)).thenReturn(Optional.of(crearPago()));
        Pago result = pagoService.buscarPagoPorId(1L);
        assertNotNull(result);
        assertEquals("TARJETA", result.getMetodoPago());
    }

    @Test
    void buscarPagoPorId_noExistente_debeRetornarNull() {
        when(pagoRepository.findById(99L)).thenReturn(Optional.empty());
        assertNull(pagoService.buscarPagoPorId(99L));
    }

    @Test
    void guardarPago_debeRetornarPagoGuardado() {
        Pago p = crearPago();
        when(pagoRepository.save(p)).thenReturn(p);
        Pago result = pagoService.guardarPago(p);
        assertNotNull(result);
        assertEquals(25000.0, result.getMonto());
    }

    @Test
    void actualizarPago_existente_debeActualizar() {
        Pago original = crearPago();
        Pago actualizado = new Pago();
        actualizado.setPedidoId(3L);
        actualizado.setMetodoPago("EFECTIVO");
        actualizado.setMonto(25000.0);
        actualizado.setEstadoPago("APROBADO");
        actualizado.setFechaPago("2025-07-02");

        when(pagoRepository.findById(1L)).thenReturn(Optional.of(original));
        when(pagoRepository.save(any(Pago.class))).thenReturn(original);

        Pago result = pagoService.actualizarPago(1L, actualizado);
        assertNotNull(result);
    }

    @Test
    void actualizarPago_noExistente_debeRetornarNull() {
        when(pagoRepository.findById(99L)).thenReturn(Optional.empty());
        assertNull(pagoService.actualizarPago(99L, new Pago()));
    }

    @Test
    void eliminarPago_debeLlamarDeleteById() {
        doNothing().when(pagoRepository).deleteById(1L);
        pagoService.eliminarPago(1L);
        verify(pagoRepository, times(1)).deleteById(1L);
    }
}
