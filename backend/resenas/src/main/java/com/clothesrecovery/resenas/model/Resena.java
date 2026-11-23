package com.clothesrecovery.resenas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "resena")
public class Resena {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false)
    private Long clienteId;

    @NotNull
    @Column(nullable = false)
    private Long productoId;

    @NotNull
    @Min(1)
    @Max(5)
    @Column(nullable = false)
    private Integer calificacion;

    @Column(length = 500)
    private String comentario;

    @Column(nullable = false)
    private LocalDateTime fecha;

}