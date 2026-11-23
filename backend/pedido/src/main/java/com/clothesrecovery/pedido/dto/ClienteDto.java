package com.clothesrecovery.pedido.dto;

import lombok.Data;

@Data
public class ClienteDto {
    private Long id;
    private String nombreCompleto;
    private String correo;
    private String telefono;
}