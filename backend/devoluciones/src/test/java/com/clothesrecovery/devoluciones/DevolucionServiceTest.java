package com.clothesrecovery.devoluciones;

import com.clothesrecovery.devoluciones.model.Devolucion;
import com.clothesrecovery.devoluciones.repository.DevolucionRepository;
import com.clothesrecovery.devoluciones.service.DevolucionService;
import com.clothesrecovery.devoluciones.service.EstadoInvalidoException;

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
class DevolucionServiceTest {

    @Mock
    private DevolucionRepository devolucionRepository;

    @InjectMocks
    private DevolucionService devolucionService;

    private Devolucion crearDevolucion(String estado) {
        Devolucion d = new Devolucion();
        d.setId(1L);
        d.setPedidoId(2L);
        d.setProductoId(3L);
        d.setClienteId(10L);
        d.setMotivo("Talla incorrecta");
        d.setEstado(estado);
        d.setFechaSolicitud(LocalDateTime.now());
        return d;
    }

    @Test
    void listarDevoluciones_debeRetornarLista() {
        when(devolucionRepository.findAll()).thenReturn(List.of(crearDevolucion("PENDIENTE")));
        List<Devolucion> result = devolucionService.listarDevoluciones();
        assertFalse(result.isEmpty());
    }

    @Test
    void crearDevolucion_debeAsignarEstadoPendiente() {
        Devolucion d = new Devolucion();
        d.setMotivo("Producto dañado");
        when(devolucionRepository.save(any(Devolucion.class))).thenReturn(d);

        Devolucion result = devolucionService.crearDevolucion(d);
        assertEquals("PENDIENTE", result.getEstado());
        assertNotNull(result.getFechaSolicitud());
    }

    @Test
    void actualizarEstado_pendienteAAprobada_debeActualizar() {
        Devolucion d = crearDevolucion("PENDIENTE");
        when(devolucionRepository.findById(1L)).thenReturn(Optional.of(d));
        when(devolucionRepository.save(any(Devolucion.class))).thenReturn(d);

        Devolucion result = devolucionService.actualizarEstado(1L, "APROBADA");
        assertEquals("APROBADA", result.getEstado());
    }

    @Test
    void actualizarEstado_pendienteARechazada_debeActualizar() {
        Devolucion d = crearDevolucion("PENDIENTE");
        when(devolucionRepository.findById(1L)).thenReturn(Optional.of(d));
        when(devolucionRepository.save(any(Devolucion.class))).thenReturn(d);

        Devolucion result = devolucionService.actualizarEstado(1L, "RECHAZADA");
        assertEquals("RECHAZADA", result.getEstado());
    }

    @Test
    void actualizarEstado_yaResuelta_debeLanzarExcepcion() {
        Devolucion d = crearDevolucion("APROBADA");
        when(devolucionRepository.findById(1L)).thenReturn(Optional.of(d));

        assertThrows(EstadoInvalidoException.class,
                () -> devolucionService.actualizarEstado(1L, "RECHAZADA"));
    }

    @Test
    void actualizarEstado_estadoInvalido_debeLanzarExcepcion() {
        Devolucion d = crearDevolucion("PENDIENTE");
        when(devolucionRepository.findById(1L)).thenReturn(Optional.of(d));

        assertThrows(EstadoInvalidoException.class,
                () -> devolucionService.actualizarEstado(1L, "INVALIDO"));
    }

    @Test
    void actualizarEstado_noExistente_debeLanzarExcepcion() {
        when(devolucionRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(EstadoInvalidoException.class,
                () -> devolucionService.actualizarEstado(99L, "APROBADA"));
    }

    @Test
    void eliminarDevolucion_debeLlamarDeleteById() {
        doNothing().when(devolucionRepository).deleteById(1L);
        devolucionService.eliminarDevolucion(1L);
        verify(devolucionRepository, times(1)).deleteById(1L);
    }
}
