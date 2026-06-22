package com.clothesrecovery.pago.dto;

import lombok.Data;

@Data
public class PedidoDto {
    private Long id;
    private Long clienteId;
    private Long productoId;
    private Integer cantidad;
    private Double total;
    private String estadoPedido;
    private String fechaPedido;
}