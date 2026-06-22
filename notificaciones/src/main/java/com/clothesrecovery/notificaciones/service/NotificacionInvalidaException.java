package com.clothesrecovery.notificaciones.service;

public class NotificacionInvalidaException extends RuntimeException {

    public NotificacionInvalidaException(String mensaje) {
        super(mensaje);
    }

}