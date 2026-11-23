package com.clothesrecovery.usuarios;

import com.clothesrecovery.usuarios.client.ExternalServiceClient;
import com.clothesrecovery.usuarios.dto.RegistroRequest;
import com.clothesrecovery.usuarios.model.Usuario;
import com.clothesrecovery.usuarios.repository.UsuarioRepository;
import com.clothesrecovery.usuarios.service.CredencialesInvalidasException;
import com.clothesrecovery.usuarios.service.RegistroInvalidoException;
import com.clothesrecovery.usuarios.service.UsuarioService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private ExternalServiceClient externalServiceClient;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario crearUsuario() {
        Usuario u = new Usuario();
        u.setId(1L);
        u.setNombre("Juan Pérez");
        u.setUsername("juan@example.com");
        u.setPassword("hash");
        u.setRol("CLIENTE");
        u.setClienteId(10L);
        return u;
    }

    @Test
    void autenticar_credencialesCorrectas_debeRetornarUsuario() {
        when(usuarioRepository.findByUsername("juan@example.com")).thenReturn(Optional.of(crearUsuario()));
        when(passwordEncoder.matches("clave123", "hash")).thenReturn(true);

        Usuario result = usuarioService.autenticar("juan@example.com", "clave123");
        assertEquals("CLIENTE", result.getRol());
    }

    @Test
    void autenticar_passwordIncorrecta_debeLanzarExcepcion() {
        when(usuarioRepository.findByUsername("juan@example.com")).thenReturn(Optional.of(crearUsuario()));
        when(passwordEncoder.matches("otra", "hash")).thenReturn(false);

        assertThrows(CredencialesInvalidasException.class,
                () -> usuarioService.autenticar("juan@example.com", "otra"));
    }

    @Test
    void autenticar_usuarioNoExiste_debeLanzarExcepcion() {
        when(usuarioRepository.findByUsername("nadie@example.com")).thenReturn(Optional.empty());

        assertThrows(CredencialesInvalidasException.class,
                () -> usuarioService.autenticar("nadie@example.com", "clave123"));
    }

    @Test
    void registrarCliente_nuevo_debeGuardarConRolCliente() {
        RegistroRequest request = new RegistroRequest("Juan Pérez", "juan@example.com", "clave123", "912345678");

        when(usuarioRepository.existsByUsername("juan@example.com")).thenReturn(false);
        when(externalServiceClient.crearCliente("Juan Pérez", "juan@example.com", "912345678")).thenReturn(10L);
        when(passwordEncoder.encode("clave123")).thenReturn("hash");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Usuario result = usuarioService.registrarCliente(request);
        assertEquals("CLIENTE", result.getRol());
        assertEquals("hash", result.getPassword());
        assertEquals(10L, result.getClienteId());
    }

    @Test
    void registrarCliente_duplicado_debeLanzarExcepcion() {
        RegistroRequest request = new RegistroRequest("Juan Pérez", "juan@example.com", "clave123", "912345678");
        when(usuarioRepository.existsByUsername("juan@example.com")).thenReturn(true);

        assertThrows(RegistroInvalidoException.class,
                () -> usuarioService.registrarCliente(request));
    }

    @Test
    void registrarCliente_sinPassword_debeLanzarExcepcion() {
        RegistroRequest request = new RegistroRequest("Juan Pérez", "juan@example.com", "", "912345678");

        assertThrows(RegistroInvalidoException.class,
                () -> usuarioService.registrarCliente(request));
    }
}
