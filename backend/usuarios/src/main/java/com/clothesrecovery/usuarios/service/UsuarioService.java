package com.clothesrecovery.usuarios.service;

import com.clothesrecovery.usuarios.client.ExternalServiceClient;
import com.clothesrecovery.usuarios.dto.RegistroRequest;
import com.clothesrecovery.usuarios.model.Usuario;
import com.clothesrecovery.usuarios.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ExternalServiceClient externalServiceClient;

    public Usuario autenticar(String username, String password) {

        if (estaVacio(username) || estaVacio(password)) {
            throw new CredencialesInvalidasException("Usuario o contraseña incorrectos");
        }

        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new CredencialesInvalidasException("Usuario o contraseña incorrectos"));

        if (!passwordEncoder.matches(password, usuario.getPassword())) {
            throw new CredencialesInvalidasException("Usuario o contraseña incorrectos");
        }

        return usuario;
    }

    public Usuario registrarCliente(RegistroRequest request) {

        if (estaVacio(request.getNombre()) || estaVacio(request.getUsername()) || estaVacio(request.getPassword())) {
            throw new RegistroInvalidoException("Nombre, usuario y contraseña son obligatorios");
        }

        if (usuarioRepository.existsByUsername(request.getUsername())) {
            throw new RegistroInvalidoException("Ya existe un usuario registrado con " + request.getUsername());
        }

        Long clienteId = externalServiceClient.crearCliente(
                request.getNombre(), request.getUsername(), request.getTelefono());

        if (clienteId == null) {
            throw new RegistroInvalidoException("No se pudo crear el cliente asociado al usuario");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setUsername(request.getUsername());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setRol("CLIENTE");
        usuario.setClienteId(clienteId);

        return usuarioRepository.save(usuario);
    }

    private boolean estaVacio(String texto) {
        return texto == null || texto.isBlank();
    }
}
