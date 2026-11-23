package com.clothesrecovery.usuarios.client;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.Map;

@Service
public class ExternalServiceClient {

    private final RestClient restClient = RestClient.create();

    public Long crearCliente(String nombreCompleto, String correo, String telefono) {
        Map<String, String> cliente = new HashMap<>();
        cliente.put("nombreCompleto", nombreCompleto);
        cliente.put("correo", correo);
        cliente.put("telefono", telefono != null ? telefono : "");

        try {
            Map<?, ?> respuesta = restClient.post()
                    .uri("http://localhost:8081/api/v1/clientes")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(cliente)
                    .retrieve()
                    .body(Map.class);

            if (respuesta == null || respuesta.get("id") == null) {
                return null;
            }

            return ((Number) respuesta.get("id")).longValue();

        } catch (Exception e) {
            return null;
        }
    }
}
