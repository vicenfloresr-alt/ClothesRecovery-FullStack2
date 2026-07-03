package com.clothesrecovery.usuarios;

import com.clothesrecovery.usuarios.security.TokenGenerator;
import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class TokenGeneratorTest {

    private final TokenGenerator tokenGenerator = new TokenGenerator();

    @Test
    void createToken_debeRetornarTokenNoNulo() {
        String token = tokenGenerator.createToken("admin");
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void createToken_debeContenerUsername() {
        String token = tokenGenerator.createToken("juan.perez");
        DecodedJWT decoded = JWT.decode(token);
        assertEquals("juan.perez", decoded.getSubject());
    }

    @Test
    void createToken_debeContenerIssuerCorrecto() {
        String token = tokenGenerator.createToken("admin");
        DecodedJWT decoded = JWT.decode(token);
        assertEquals("servicio-auth", decoded.getIssuer());
    }

    @Test
    void createToken_debeTenerFechaExpiracion() {
        String token = tokenGenerator.createToken("admin");
        DecodedJWT decoded = JWT.decode(token);
        assertNotNull(decoded.getExpiresAt());
        assertTrue(decoded.getExpiresAt().getTime() > System.currentTimeMillis());
    }

    @Test
    void createToken_distintoUsuario_debeGenerarTokenDistinto() {
        String token1 = tokenGenerator.createToken("usuario1");
        String token2 = tokenGenerator.createToken("usuario2");
        assertNotEquals(token1, token2);
    }
}
