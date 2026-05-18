package com.clothesrecovery.catalogo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "producto")

@Data
@AllArgsConstructor
@NoArgsConstructor

public class Catalogo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nombre;
   
    @Column(nullable = false)
    private String categoria;
    
    @Column(nullable = false)
    private String talla;

    @Column(nullable = false)
    private Double precio;

    @Column(nullable = false)
    private Integer stock;
}