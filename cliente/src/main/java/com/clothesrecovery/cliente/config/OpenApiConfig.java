package com.clothesrecovery.cliente.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Microservicio Cliente")
                        .version("1.0")
                        .description("Gestión de clientes Clothes Recovery")
                        .contact(new Contact()
                                .name("Equipo FullStack")
                                .email("equipo@clothesrecovery.cl")));
    }
}