package com.clothesrecovery.cliente.service;

import com.clothesrecovery.cliente.model.Cliente;
import com.clothesrecovery.cliente.repository.ClienteRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    public List<Cliente> listarClientes() {
        return clienteRepository.findAll();
    }

    public Cliente buscarClientePorId(Long id) {
        return clienteRepository.findById(id).orElse(null);
    }

    public Cliente guardarCliente(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    public Cliente actualizarCliente(Long id, Cliente clienteActualizado) {

        Cliente cliente = clienteRepository.findById(id).orElse(null);

        if (cliente != null) {

            cliente.setNombreCompleto(clienteActualizado.getNombreCompleto());
            cliente.setCorreo(clienteActualizado.getCorreo());
            cliente.setTelefono(clienteActualizado.getTelefono());

            return clienteRepository.save(cliente);
        }

        return null;
    }

    public void eliminarCliente(Long id) {
        clienteRepository.deleteById(id);
    }
}