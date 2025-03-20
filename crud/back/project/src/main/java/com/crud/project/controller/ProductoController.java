package com.crud.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.crud.project.model.ProductoModel;
import com.crud.project.repository.ProductoRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class ProductoController {
    
    @Autowired
    public ProductoRepository productoRepository;

    @GetMapping(value ="/producto")
    public Iterable<ProductoModel> getAllProductos(){
        return productoRepository.findAll();
    }

    @PostMapping(value = "/producto/new")
    public ProductoModel saveProducto(@RequestBody ProductoModel producto){
        return productoRepository.save(producto);
    }

    @DeleteMapping(value="/producto/delete/{id}")
    public void deleteProducto(@PathVariable Integer id){
        productoRepository.deleteById(id);
    }

    @PatchMapping(value="/producto/patch/{id}")
    public ProductoModel patchProducto(@PathVariable Integer id, @RequestBody ProductoModel producto) {
        return productoRepository.findById(id).map(p -> {
            if (producto.getNombreproducto() != null) {
                p.setNombreproducto(producto.getNombreproducto());
            }
            if (producto.getPrecioproducto() != null) {
                p.setPrecioproducto(producto.getPrecioproducto());
            }
            if (producto.getCantidadproducto() != null) {
                p.setCantidadproducto(producto.getCantidadproducto());
            }
            if (producto.getFecha() != null) {
                p.setFecha(producto.getFecha());
            }
            return productoRepository.save(p);
        }).orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + id));
    }
}
