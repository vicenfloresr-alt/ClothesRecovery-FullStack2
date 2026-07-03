package com.clothesrecovery.envio;

import com.clothesrecovery.envio.model.Envio;
import com.clothesrecovery.envio.repository.EnvioRepository;
import com.clothesrecovery.envio.service.EnvioService;

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
class EnvioServiceTest {

    @Mock
    private EnvioRepository envioRepository;

    @InjectMocks
    private EnvioService envioService;

    private Envio crearEnvio() {
        Envio e = new Envio();
        e.setId(1L);
        e.setPedidoId(2L);
        e.setDireccionEnvio("Av. Siempre Viva 123");
        e.setCiudad("Santiago");
        e.setEstadoEnvio("EN_CAMINO");
        e.setFechaEnvio("2025-07-01");
        return e;
    }

    @Test
    void listarEnvios_debeRetornarLista() {
        when(envioRepository.findAll()).thenReturn(List.of(crearEnvio()));
        List<Envio> result = envioService.listarEnvios();
        assertFalse(result.isEmpty());
    }

    @Test
    void buscarEnvioPorId_existente_debeRetornarEnvio() {
        when(envioRepository.findById(1L)).thenReturn(Optional.of(crearEnvio()));
        Envio result = envioService.buscarEnvioPorId(1L);
        assertNotNull(result);
        assertEquals("Santiago", result.getCiudad());
    }

    @Test
    void buscarEnvioPorId_noExistente_debeRetornarNull() {
        when(envioRepository.findById(99L)).thenReturn(Optional.empty());
        assertNull(envioService.buscarEnvioPorId(99L));
    }

    @Test
    void guardarEnvio_debeRetornarEnvioGuardado() {
        Envio e = crearEnvio();
        when(envioRepository.save(e)).thenReturn(e);
        Envio result = envioService.guardarEnvio(e);
        assertNotNull(result);
        assertEquals("EN_CAMINO", result.getEstadoEnvio());
    }

    @Test
    void actualizarEnvio_existente_debeActualizar() {
        Envio original = crearEnvio();
        Envio actualizado = new Envio();
        actualizado.setPedidoId(2L);
        actualizado.setDireccionEnvio("Calle Nueva 456");
        actualizado.setCiudad("Valparaíso");
        actualizado.setEstadoEnvio("ENTREGADO");
        actualizado.setFechaEnvio("2025-07-02");

        when(envioRepository.findById(1L)).thenReturn(Optional.of(original));
        when(envioRepository.save(any(Envio.class))).thenReturn(original);

        Envio result = envioService.actualizarEnvio(1L, actualizado);
        assertNotNull(result);
    }

    @Test
    void actualizarEnvio_noExistente_debeRetornarNull() {
        when(envioRepository.findById(99L)).thenReturn(Optional.empty());
        assertNull(envioService.actualizarEnvio(99L, new Envio()));
    }

    @Test
    void eliminarEnvio_debeLlamarDeleteById() {
        doNothing().when(envioRepository).deleteById(1L);
        envioService.eliminarEnvio(1L);
        verify(envioRepository, times(1)).deleteById(1L);
    }
}
