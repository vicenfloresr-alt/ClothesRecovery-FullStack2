package com.clothesrecovery.usuarios.config;

import com.clothesrecovery.usuarios.model.Usuario;
import com.clothesrecovery.usuarios.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        crearSiNoExiste("Administrador", "admin@clothesrecovery.cl", "admin123", "ADMIN");
        crearSiNoExiste("Vendedor", "vendedor@clothesrecovery.cl", "vendedor123", "VENDEDOR");
    }

    private void crearSiNoExiste(String nombre, String username, String password, String rol) {
        if (!usuarioRepository.existsByUsername(username)) {
            Usuario usuario = new Usuario();
            usuario.setNombre(nombre);
            usuario.setUsername(username);
            usuario.setPassword(passwordEncoder.encode(password));
            usuario.setRol(rol);
            usuarioRepository.save(usuario);
        }
    }
}
