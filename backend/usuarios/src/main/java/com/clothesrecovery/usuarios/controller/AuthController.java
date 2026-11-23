package com.clothesrecovery.usuarios.controller;

import com.clothesrecovery.usuarios.dto.LoginRequest;
import com.clothesrecovery.usuarios.dto.RegistroRequest;
import com.clothesrecovery.usuarios.model.Usuario;
import com.clothesrecovery.usuarios.security.TokenGenerator;
import com.clothesrecovery.usuarios.service.CredencialesInvalidasException;
import com.clothesrecovery.usuarios.service.RegistroInvalidoException;
import com.clothesrecovery.usuarios.service.UsuarioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Autenticación", description = "Inicio de sesión y registro de usuarios con JWT")
public class AuthController {

    @Autowired
    private TokenGenerator tokenGenerator;

    @Autowired
    private UsuarioService usuarioService;

    @Operation(summary = "Iniciar sesión y obtener un token JWT")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        try {
            Usuario usuario = usuarioService.autenticar(request.getUsername(), request.getPassword());

            Map<String, Object> respuesta = datosUsuario(usuario);
            respuesta.put("token", tokenGenerator.createToken(usuario.getUsername(), usuario.getRol()));

            return ResponseEntity.ok(respuesta);

        } catch (CredencialesInvalidasException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @Operation(summary = "Registrar un nuevo usuario con rol CLIENTE")
    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody RegistroRequest request) {

        try {
            Usuario usuario = usuarioService.registrarCliente(request);

            return ResponseEntity.status(HttpStatus.CREATED).body(datosUsuario(usuario));

        } catch (RegistroInvalidoException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    private Map<String, Object> datosUsuario(Usuario usuario) {
        Map<String, Object> datos = new LinkedHashMap<>();
        datos.put("id", usuario.getId());
        datos.put("nombre", usuario.getNombre());
        datos.put("username", usuario.getUsername());
        datos.put("rol", usuario.getRol());
        datos.put("clienteId", usuario.getClienteId());
        return datos;
    }
}