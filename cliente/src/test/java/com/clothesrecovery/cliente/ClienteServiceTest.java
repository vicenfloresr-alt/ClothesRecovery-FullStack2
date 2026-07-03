package com.clothesrecovery.cliente;

import com.clothesrecovery.cliente.model.Cliente;
import com.clothesrecovery.cliente.repository.ClienteRepository;
import com.clothesrecovery.cliente.service.ClienteService;

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
class ClienteServiceTest {

    @Mock
    private ClienteRepository clienteRepository;

    @InjectMocks
    private ClienteService clienteService;

    private Cliente crearCliente() {
        Cliente c = new Cliente();
        c.setId(1L);
        c.setNombreCompleto("Juan Pérez");
        c.setCorreo("juan@example.com");
        c.setTelefono("912345678");
        return c;
    }

    @Test
    void listarClientes_debeRetornarLista() {
        when(clienteRepository.findAll()).thenReturn(List.of(crearCliente()));
        List<Cliente> result = clienteService.listarClientes();
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
    }

    @Test
    void buscarClientePorId_existente_debeRetornarCliente() {
        when(clienteRepository.findById(1L)).thenReturn(Optional.of(crearCliente()));
        Cliente result = clienteService.buscarClientePorId(1L);
        assertNotNull(result);
        assertEquals("Juan Pérez", result.getNombreCompleto());
    }

    @Test
    void buscarClientePorId_noExistente_debeRetornarNull() {
        when(clienteRepository.findById(99L)).thenReturn(Optional.empty());
        Cliente result = clienteService.buscarClientePorId(99L);
        assertNull(result);
    }

    @Test
    void guardarCliente_debeRetornarClienteGuardado() {
        Cliente c = crearCliente();
        when(clienteRepository.save(c)).thenReturn(c);
        Cliente result = clienteService.guardarCliente(c);
        assertNotNull(result);
        assertEquals("juan@example.com", result.getCorreo());
    }

    @Test
    void actualizarCliente_existente_debeActualizar() {
        Cliente original = crearCliente();
        Cliente actualizado = new Cliente();
        actualizado.setNombreCompleto("Pedro López");
        actualizado.setCorreo("pedro@example.com");
        actualizado.setTelefono("987654321");

        when(clienteRepository.findById(1L)).thenReturn(Optional.of(original));
        when(clienteRepository.save(any(Cliente.class))).thenReturn(original);

        Cliente result = clienteService.actualizarCliente(1L, actualizado);
        assertNotNull(result);
        assertEquals("Pedro López", result.getNombreCompleto());
    }

    @Test
    void actualizarCliente_noExistente_debeRetornarNull() {
        when(clienteRepository.findById(99L)).thenReturn(Optional.empty());
        Cliente result = clienteService.actualizarCliente(99L, new Cliente());
        assertNull(result);
    }

    @Test
    void eliminarCliente_debeLlamarDeleteById() {
        doNothing().when(clienteRepository).deleteById(1L);
        clienteService.eliminarCliente(1L);
        verify(clienteRepository, times(1)).deleteById(1L);
    }
}
