package com.clothesrecovery.pedido.client;

import com.clothesrecovery.pedido.dto.ClienteDto;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class ExternalServiceClient {

    private final WebClient webClient;

    public ExternalServiceClient(WebClient webClient) {
        this.webClient = webClient;
    }

    public ClienteDto obtenerCliente(Long idCliente) {
        try {
            return webClient.get()
                .uri("http://localhost:8081/api/clientes/" + idCliente)
                .retrieve()
                .bodyToMono(ClienteDto.class)
                .block();
        } catch (Exception e) {
            return null;
        }
    }
}