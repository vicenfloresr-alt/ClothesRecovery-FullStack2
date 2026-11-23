package com.clothesrecovery.usuarios.dto;

public class RegistroRequest {
    private String nombre;
    private String username;
    private String password;
    private String telefono;

    public RegistroRequest() {}

    public RegistroRequest(String nombre, String username, String password, String telefono) {
        this.nombre = nombre;
        this.username = username;
        this.password = password;
        this.telefono = telefono;
    }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
}
