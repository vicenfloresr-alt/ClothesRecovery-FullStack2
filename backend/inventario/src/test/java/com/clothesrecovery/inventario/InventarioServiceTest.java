package com.clothesrecovery.inventario;

import com.clothesrecovery.inventario.model.Inventario;
import com.clothesrecovery.inventario.repository.InventarioRepository;
import com.clothesrecovery.inventario.service.InventarioService;
import com.clothesrecovery.inventario.service.StockInsuficienteException;

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
class InventarioServiceTest {

    @Mock
    private InventarioRepository inventarioRepository;

    @InjectMocks
    private InventarioService inventarioService;

    private Inventario crearInventario() {
        Inventario i = new Inventario();
        i.setId(1L);
        i.setProductoId(5L);
        i.setCantidadDisponible(100);
        i.setUbicacionBodega("Bodega A");
        return i;
    }

    @Test
    void listarInventario_debeRetornarLista() {
        when(inventarioRepository.findAll()).thenReturn(List.of(crearInventario()));
        List<Inventario> result = inventarioService.listarInventario();
        assertFalse(result.isEmpty());
    }

    @Test
    void buscarPorId_existente_debeRetornarInventario() {
        when(inventarioRepository.findById(1L)).thenReturn(Optional.of(crearInventario()));
        Inventario result = inventarioService.buscarPorId(1L);
        assertNotNull(result);
        assertEquals(100, result.getCantidadDisponible());
    }

    @Test
    void buscarPorProductoId_existente_debeRetornarInventario() {
        when(inventarioRepository.findByProductoId(5L)).thenReturn(Optional.of(crearInventario()));
        Inventario result = inventarioService.buscarPorProductoId(5L);
        assertNotNull(result);
    }

    @Test
    void descontarStock_suficiente_debeDescontar() {
        Inventario inv = crearInventario();
        when(inventarioRepository.findByProductoId(5L)).thenReturn(Optional.of(inv));
        when(inventarioRepository.save(any(Inventario.class))).thenReturn(inv);

        Inventario result = inventarioService.descontarStock(5L, 10);
        assertEquals(90, result.getCantidadDisponible());
    }

    @Test
    void descontarStock_insuficiente_debeLanzarExcepcion() {
        Inventario inv = crearInventario();
        inv.setCantidadDisponible(5);
        when(inventarioRepository.findByProductoId(5L)).thenReturn(Optional.of(inv));

        assertThrows(StockInsuficienteException.class,
                () -> inventarioService.descontarStock(5L, 10));
    }

    @Test
    void descontarStock_productoNoExiste_debeLanzarExcepcion() {
        when(inventarioRepository.findByProductoId(99L)).thenReturn(Optional.empty());
        assertThrows(StockInsuficienteException.class,
                () -> inventarioService.descontarStock(99L, 5));
    }

    @Test
    void reponerStock_debeAumentarCantidad() {
        Inventario inv = crearInventario();
        when(inventarioRepository.findByProductoId(5L)).thenReturn(Optional.of(inv));
        when(inventarioRepository.save(any(Inventario.class))).thenReturn(inv);

        Inventario result = inventarioService.reponerStock(5L, 20);
        assertEquals(120, result.getCantidadDisponible());
    }

    @Test
    void eliminarInventario_debeLlamarDeleteById() {
        doNothing().when(inventarioRepository).deleteById(1L);
        inventarioService.eliminarInventario(1L);
        verify(inventarioRepository, times(1)).deleteById(1L);
    }
}
