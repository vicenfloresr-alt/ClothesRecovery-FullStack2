package com.clothesrecovery.pedido.service;

import com.clothesrecovery.pedido.client.ExternalServiceClient;
import com.clothesrecovery.pedido.dto.ClienteDto;
import com.clothesrecovery.pedido.model.Pedido;
import com.clothesrecovery.pedido.repository.PedidoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ExternalServiceClient externalServiceClient;

    public List<Pedido> listarPedidos() {
        return pedidoRepository.findAll();
    }

    public Pedido buscarPedidoPorId(Long id) {
        return pedidoRepository.findById(id).orElse(null);
    }

    public Pedido guardarPedido(Pedido pedido) {
        ClienteDto cliente = externalServiceClient.obtenerCliente(pedido.getClienteId());
        if (cliente == null) {
            throw new RuntimeException("Cliente no encontrado con id: " + pedido.getClienteId());
        }
        return pedidoRepository.save(pedido);
    }

    public Pedido actualizarPedido(Long id, Pedido pedidoActualizado) {
        Pedido pedido = pedidoRepository.findById(id).orElse(null);

        if (pedido != null) {
            pedido.setClienteId(pedidoActualizado.getClienteId());
            pedido.setProductoId(pedidoActualizado.getProductoId());
            pedido.setCantidad(pedidoActualizado.getCantidad());
            pedido.setTotal(pedidoActualizado.getTotal());
            pedido.setEstadoPedido(pedidoActualizado.getEstadoPedido());
            pedido.setFechaPedido(pedidoActualizado.getFechaPedido());
            return pedidoRepository.save(pedido);
        }

        return null;
    }

    public void eliminarPedido(Long id) {
        pedidoRepository.deleteById(id);
    }
}