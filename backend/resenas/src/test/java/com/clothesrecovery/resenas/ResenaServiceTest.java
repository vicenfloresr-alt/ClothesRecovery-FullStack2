package com.clothesrecovery.resenas;

import com.clothesrecovery.resenas.model.Resena;
import com.clothesrecovery.resenas.repository.ResenaRepository;
import com.clothesrecovery.resenas.service.ResenaDuplicadaException;
import com.clothesrecovery.resenas.service.ResenaService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ResenaServiceTest {

    @Mock
    private ResenaRepository resenaRepository;

    @InjectMocks
    private ResenaService resenaService;

    private Resena crearResena() {
        Resena r = new Resena();
        r.setId(1L);
        r.setClienteId(10L);
        r.setProductoId(5L);
        r.setCalificacion(5);
        r.setComentario("Excelente producto");
        r.setFecha(LocalDateTime.now());
        return r;
    }

    @Test
    void listarResenas_debeRetornarLista() {
        when(resenaRepository.findAll()).thenReturn(List.of(crearResena()));
        List<Resena> result = resenaService.listarResenas();
        assertFalse(result.isEmpty());
    }

    @Test
    void buscarPorId_existente_debeRetornarResena() {
        when(resenaRepository.findById(1L)).thenReturn(Optional.of(crearResena()));
        Resena result = resenaService.buscarPorId(1L);
        assertNotNull(result);
        assertEquals(5, result.getCalificacion());
    }

    @Test
    void crearResena_nueva_debeGuardar() {
        Resena r = crearResena();
        when(resenaRepository.findByClienteIdAndProductoId(10L, 5L)).thenReturn(Optional.empty());
        when(resenaRepository.save(any(Resena.class))).thenReturn(r);

        Resena result = resenaService.crearResena(r);
        assertNotNull(result);
        assertNotNull(result.getFecha());
    }

    @Test
    void crearResena_duplicada_debeLanzarExcepcion() {
        Resena r = crearResena();
        when(resenaRepository.findByClienteIdAndProductoId(10L, 5L))
                .thenReturn(Optional.of(r));

        assertThrows(ResenaDuplicadaException.class,
                () -> resenaService.crearResena(r));
    }

    @Test
    void actualizarResena_existente_debeActualizar() {
        Resena original = crearResena();
        Resena actualizada = new Resena();
        actualizada.setCalificacion(3);
        actualizada.setComentario("Regular");

        when(resenaRepository.findById(1L)).thenReturn(Optional.of(original));
        when(resenaRepository.save(any(Resena.class))).thenReturn(original);

        Resena result = resenaService.actualizarResena(1L, actualizada);
        assertNotNull(result);
    }

    @Test
    void actualizarResena_noExistente_debeRetornarNull() {
        when(resenaRepository.findById(99L)).thenReturn(Optional.empty());
        assertNull(resenaService.actualizarResena(99L, new Resena()));
    }

    @Test
    void eliminarResena_debeLlamarDeleteById() {
        doNothing().when(resenaRepository).deleteById(1L);
        resenaService.eliminarResena(1L);
        verify(resenaRepository, times(1)).deleteById(1L);
    }
}
