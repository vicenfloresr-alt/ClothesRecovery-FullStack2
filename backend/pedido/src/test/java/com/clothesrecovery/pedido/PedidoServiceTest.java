package com.clothesrecovery.pedido;

import com.clothesrecovery.pedido.model.Pedido;
import com.clothesrecovery.pedido.repository.PedidoRepository;
import com.clothesrecovery.pedido.service.PedidoService;

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
class PedidoServiceTest {

    @Mock
    private PedidoRepository pedidoRepository;

    @InjectMocks
    private PedidoService pedidoService;

    private Pedido crearPedido() {
        Pedido p = new Pedido();
        p.setId(1L);
        p.setClienteId(10L);
        p.setProductoId(5L);
        p.setCantidad(2);
        p.setTotal(30000.0);
        p.setEstadoPedido("PENDIENTE");
        p.setFechaPedido("2025-07-01");
        return p;
    }

    @Test
    void listarPedidos_debeRetornarLista() {
        when(pedidoRepository.findAll()).thenReturn(List.of(crearPedido()));
        List<Pedido> result = pedidoService.listarPedidos();
        assertFalse(result.isEmpty());
    }

    @Test
    void buscarPedidoPorId_existente_debeRetornarPedido() {
        when(pedidoRepository.findById(1L)).thenReturn(Optional.of(crearPedido()));
        Pedido result = pedidoService.buscarPedidoPorId(1L);
        assertNotNull(result);
        assertEquals("PENDIENTE", result.getEstadoPedido());
    }

    @Test
    void buscarPedidoPorId_noExistente_debeRetornarNull() {
        when(pedidoRepository.findById(99L)).thenReturn(Optional.empty());
        assertNull(pedidoService.buscarPedidoPorId(99L));
    }

    @Test
    void guardarPedido_debeRetornarPedidoGuardado() {
        Pedido p = crearPedido();
        when(pedidoRepository.save(p)).thenReturn(p);
        Pedido result = pedidoService.guardarPedido(p);
        assertNotNull(result);
        assertEquals(30000.0, result.getTotal());
    }

    @Test
    void actualizarPedido_existente_debeActualizar() {
        Pedido original = crearPedido();
        Pedido actualizado = new Pedido();
        actualizado.setClienteId(10L);
        actualizado.setProductoId(5L);
        actualizado.setCantidad(3);
        actualizado.setTotal(45000.0);
        actualizado.setEstadoPedido("ENVIADO");
        actualizado.setFechaPedido("2025-07-02");

        when(pedidoRepository.findById(1L)).thenReturn(Optional.of(original));
        when(pedidoRepository.save(any(Pedido.class))).thenReturn(original);

        Pedido result = pedidoService.actualizarPedido(1L, actualizado);
        assertNotNull(result);
    }

    @Test
    void actualizarPedido_noExistente_debeRetornarNull() {
        when(pedidoRepository.findById(99L)).thenReturn(Optional.empty());
        assertNull(pedidoService.actualizarPedido(99L, new Pedido()));
    }

    @Test
    void eliminarPedido_debeLlamarDeleteById() {
        doNothing().when(pedidoRepository).deleteById(1L);
        pedidoService.eliminarPedido(1L);
        verify(pedidoRepository, times(1)).deleteById(1L);
    }
}
