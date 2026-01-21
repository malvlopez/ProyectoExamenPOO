package com.example.ProyectoExamenPOO.service;

import com.example.ProyectoExamenPOO.model.entity.Estudiante;
import com.example.ProyectoExamenPOO.repository.IEstudianteRepository;
import com.example.ProyectoExamenPOO.service.IEstudianteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EstudianteService implements IEstudianteService {
    private final IEstudianteRepository estudianteRepository;

    public EstudianteService(IEstudianteRepository estudianteRepository) {
        this.estudianteRepository = estudianteRepository;
    }

    @Override
    public List<Estudiante> getEstudiante() {
        return estudianteRepository.findAll();
    }

    @Override
    public Estudiante findEstudiante(Long id) {
        return estudianteRepository.findById(id).orElse(null);
    }

    @Override
    public void saveEstudiante(Estudiante estudiante) {
        estudianteRepository.save(estudiante);
    }

    @Override
    public void deleteEstudiante(Long id) {
        estudianteRepository.deleteById(id);
    }

    @Override
    public Estudiante updateEstudiante(Long id, Estudiante datosNuevos) {
        Estudiante estudianteExistente = estudianteRepository.findById(id).orElse(null);

        if (estudianteExistente == null) {
            return null;
        }
        if (datosNuevos.getName() != null) {
            estudianteExistente.setName(datosNuevos.getName());
        }
        if (datosNuevos.getLastName() != null) {
            estudianteExistente.setLastName(datosNuevos.getLastName());
        }
        if (datosNuevos.getAge() != null) {
            estudianteExistente.setAge(datosNuevos.getAge());
        }
        if (datosNuevos.getEmail() != null) {
            estudianteExistente.setEmail(datosNuevos.getEmail());
        }
        if (datosNuevos.getCareer() != null) {
            estudianteExistente.setCareer(datosNuevos.getCareer());
        }
        return estudianteRepository.save(estudianteExistente);
    }


}