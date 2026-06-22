package com.clothesrecovery.devoluciones.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "devolucion")
public class Devolucion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false)
    private Long pedidoId;

    @NotNull
    @Column(nullable = false)
    private Long productoId;

    @NotNull
    @Column(nullable = false)
    private Long clienteId;

    @NotBlank
    @Column(nullable = false)
    private String motivo;

    @NotBlank
    @Column(nullable = false)
    private String estado;

    @Column(nullable = false)
    private LocalDateTime fechaSolicitud;

}