package com.clothesrecovery.catalogo;

import com.clothesrecovery.catalogo.model.Producto;
import com.clothesrecovery.catalogo.repository.ProductoRepository;
import com.clothesrecovery.catalogo.service.ProductoService;

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
class ProductoServiceTest {

    @Mock
    private ProductoRepository productoRepository;

    @InjectMocks
    private ProductoService productoService;

    private Producto crearProducto() {
        Producto p = new Producto();
        p.setId(1L);
        p.setNombreProducto("Polera Negra");
        p.setDescripcion("Polera de algodón");
        p.setPrecio(15000.0);
        p.setStock(10);
        p.setCategoria("Ropa");
        p.setTalla("M");
        return p;
    }

    @Test
    void listarProductos_debeRetornarLista() {
        when(productoRepository.findAll()).thenReturn(List.of(crearProducto()));
        List<Producto> result = productoService.listarProductos();
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
    }

    @Test
    void buscarProductoPorId_existente_debeRetornarProducto() {
        when(productoRepository.findById(1L)).thenReturn(Optional.of(crearProducto()));
        Producto result = productoService.buscarProductoPorId(1L);
        assertNotNull(result);
        assertEquals("Polera Negra", result.getNombreProducto());
    }

    @Test
    void buscarProductoPorId_noExistente_debeRetornarNull() {
        when(productoRepository.findById(99L)).thenReturn(Optional.empty());
        assertNull(productoService.buscarProductoPorId(99L));
    }

    @Test
    void guardarProducto_debeRetornarProductoGuardado() {
        Producto p = crearProducto();
        when(productoRepository.save(p)).thenReturn(p);
        Producto result = productoService.guardarProducto(p);
        assertNotNull(result);
        assertEquals(15000.0, result.getPrecio());
    }

    @Test
    void actualizarProducto_existente_debeActualizar() {
        Producto original = crearProducto();
        Producto actualizado = new Producto();
        actualizado.setNombreProducto("Polera Blanca");
        actualizado.setDescripcion("Nueva desc");
        actualizado.setPrecio(18000.0);
        actualizado.setStock(5);
        actualizado.setCategoria("Ropa");
        actualizado.setTalla("L");

        when(productoRepository.findById(1L)).thenReturn(Optional.of(original));
        when(productoRepository.save(any(Producto.class))).thenReturn(original);

        Producto result = productoService.actualizarProducto(1L, actualizado);
        assertNotNull(result);
    }

    @Test
    void actualizarProducto_noExistente_debeRetornarNull() {
        when(productoRepository.findById(99L)).thenReturn(Optional.empty());
        assertNull(productoService.actualizarProducto(99L, new Producto()));
    }

    @Test
    void eliminarProducto_debeLlamarDeleteById() {
        doNothing().when(productoRepository).deleteById(1L);
        productoService.eliminarProducto(1L);
        verify(productoRepository, times(1)).deleteById(1L);
    }
}
