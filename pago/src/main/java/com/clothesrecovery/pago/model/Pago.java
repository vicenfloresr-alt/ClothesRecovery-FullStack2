package com.clothesrecovery.pago.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "pago")
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long pedidoId;

    @Column(nullable = false)
    private String metodoPago;

    @Column(nullable = false)
    private Double monto;

    @Column(nullable = false)
    private String estadoPago;

    @Column(nullable = false)
    private String fechaPago;

}