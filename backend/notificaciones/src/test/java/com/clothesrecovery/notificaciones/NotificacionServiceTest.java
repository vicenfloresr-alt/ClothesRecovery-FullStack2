package com.clothesrecovery.notificaciones;

import com.clothesrecovery.notificaciones.model.Notificacion;
import com.clothesrecovery.notificaciones.repository.NotificacionRepository;
import com.clothesrecovery.notificaciones.service.NotificacionInvalidaException;
import com.clothesrecovery.notificaciones.service.NotificacionService;

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
class NotificacionServiceTest {

    @Mock
    private NotificacionRepository notificacionRepository;

    @InjectMocks
    private NotificacionService notificacionService;

    private Notificacion crearNotificacion(boolean leida) {
        Notificacion n = new Notificacion();
        n.setId(1L);
        n.setDestinatarioId(10L);
        n.setTipo("PEDIDO");
        n.setMensaje("Tu pedido fue confirmado");
        n.setFecha(LocalDateTime.now());
        n.setLeida(leida);
        return n;
    }

    @Test
    void listarNotificaciones_debeRetornarLista() {
        when(notificacionRepository.findAll()).thenReturn(List.of(crearNotificacion(false)));
        List<Notificacion> result = notificacionService.listarNotificaciones();
        assertFalse(result.isEmpty());
    }

    @Test
    void buscarPorId_existente_debeRetornarNotificacion() {
        when(notificacionRepository.findById(1L)).thenReturn(Optional.of(crearNotificacion(false)));
        Notificacion result = notificacionService.buscarPorId(1L);
        assertNotNull(result);
    }

    @Test
    void crearNotificacion_debeAsignarFechaYLeidaFalse() {
        Notificacion n = new Notificacion();
        n.setDestinatarioId(10L);
        n.setTipo("PAGO");
        n.setMensaje("Pago recibido");
        when(notificacionRepository.save(any(Notificacion.class))).thenReturn(n);

        Notificacion result = notificacionService.crearNotificacion(n);
        assertFalse(result.getLeida());
        assertNotNull(result.getFecha());
    }

    @Test
    void marcarComoLeida_noLeida_debeMarcarLeida() {
        Notificacion n = crearNotificacion(false);
        when(notificacionRepository.findById(1L)).thenReturn(Optional.of(n));
        when(notificacionRepository.save(any(Notificacion.class))).thenReturn(n);

        Notificacion result = notificacionService.marcarComoLeida(1L);
        assertTrue(result.getLeida());
    }

    @Test
    void marcarComoLeida_yaLeida_debeLanzarExcepcion() {
        Notificacion n = crearNotificacion(true);
        when(notificacionRepository.findById(1L)).thenReturn(Optional.of(n));

        assertThrows(NotificacionInvalidaException.class,
                () -> notificacionService.marcarComoLeida(1L));
    }

    @Test
    void marcarComoLeida_noExistente_debeLanzarExcepcion() {
        when(notificacionRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(NotificacionInvalidaException.class,
                () -> notificacionService.marcarComoLeida(99L));
    }

    @Test
    void eliminarNotificacion_debeLlamarDeleteById() {
        doNothing().when(notificacionRepository).deleteById(1L);
        notificacionService.eliminarNotificacion(1L);
        verify(notificacionRepository, times(1)).deleteById(1L);
    }
}
