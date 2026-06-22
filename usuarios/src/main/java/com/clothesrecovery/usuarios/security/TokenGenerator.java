package com.clothesrecovery.usuarios.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import java.util.Date;
import org.springframework.stereotype.Component;

@Component
public class TokenGenerator {

    private final String SECRET_KEY = "4a6f73654d617269615365637265744b6579323032364e6577536563757265546f6b656e47656e657261746f724d6963726f7365727669636573";

    public String createToken(String username) {
        Algorithm algorithm = Algorithm.HMAC256(SECRET_KEY);

        return JWT.create()
                .withSubject(username)
                .withIssuer("servicio-auth")
                .withExpiresAt(new Date(System.currentTimeMillis() + 3600000))
                .sign(algorithm);
    }
}