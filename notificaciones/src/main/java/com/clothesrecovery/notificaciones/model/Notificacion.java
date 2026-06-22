package com.clothesrecovery.notificaciones.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "notificacion")
public class Notificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false)
    private Long destinatarioId;

    @NotBlank
    @Column(nullable = false)
    private String tipo;

    @NotBlank
    @Column(length = 500, nullable = false)
    private String mensaje;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @Column(nullable = false)
    private Boolean leida;

}