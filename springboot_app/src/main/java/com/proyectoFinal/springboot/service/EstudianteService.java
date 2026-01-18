package com.proyectoFinal.springboot.service;

import com.proyectoFinal.springboot.model.entity.Estudiante;
import com.proyectoFinal.springboot.repository.EstudianteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EstudianteService {

    @Autowired
    private EstudianteRepository repository;

    public List<Estudiante> listarTodos() {
        return repository.findAll();
    }

    public Optional<Estudiante> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public Estudiante guardar(Estudiante estudiante) {
        return repository.save(estudiante);
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}