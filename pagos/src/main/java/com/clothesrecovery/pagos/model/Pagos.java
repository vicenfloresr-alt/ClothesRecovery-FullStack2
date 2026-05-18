package com.clothesrecovery.pagos.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "pagos")
public class Pagos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String metodoPago;

    @Column(nullable = false)
    private Integer precioPrenda;

    public Pagos() {
    }

    public Pagos(Long id, String metodoPago, Integer precioPrenda) {
        this.id = id;
        this.metodoPago = metodoPago;
        this.precioPrenda = precioPrenda;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }

    public Integer getPrecioPrenda() {
        return precioPrenda;
    }

    public void setPrecioPrenda(Integer precioPrenda) {
        this.precioPrenda = precioPrenda;
    }
}
