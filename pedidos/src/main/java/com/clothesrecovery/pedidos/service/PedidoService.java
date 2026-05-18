 package com.clothesrecovery.pedidos.service;

import com.clothesrecovery.pedidos.model.Pedidos;
import com.clothesrecovery.pedidos.repository.PedidosRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PedidoService {

    @Autowired
    private PedidosRepository pedidosRepository;

    public List<Pedidos> listarPedidos() {
        return pedidosRepository.findAll();
    }

    public Pedidos buscarPedidoPorId(Long id) {
        return pedidosRepository.findById(id).orElse(null);
    }

    public Pedidos guardarPedido(Pedidos pedido) {
        return pedidosRepository.save(pedido);
    }

    public Pedidos actualizarPedido(Long id, Pedidos pedidoActualizado) {

        Pedidos pedido = pedidosRepository.findById(id).orElse(null);

        if (pedido != null) {

            pedido.setFecha(pedidoActualizado.getFecha());
            pedido.setEstado(pedidoActualizado.getEstado());
            pedido.setTotal(pedidoActualizado.getTotal());
            pedido.setClienteId(pedidoActualizado.getClienteId());

            return pedidosRepository.save(pedido);
        }

        return null;
    }

    public void eliminarPedido(Long id) {
        pedidosRepository.deleteById(id);
    }
}
