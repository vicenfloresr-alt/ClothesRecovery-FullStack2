package com.clothesrecovery.devoluciones.service;

public class EstadoInvalidoException extends RuntimeException {

    public EstadoInvalidoException(String mensaje) {
        super(mensaje);
    }

}