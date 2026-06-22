package com.clothesrecovery.envio.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "envio")
public class Envio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long pedidoId;

    @Column(nullable = false)
    private String direccionEnvio;

    @Column(nullable = false)
    private String ciudad;

    @Column(nullable = false)
    private String estadoEnvio;

    @Column(nullable = false)
    private String fechaEnvio;

}