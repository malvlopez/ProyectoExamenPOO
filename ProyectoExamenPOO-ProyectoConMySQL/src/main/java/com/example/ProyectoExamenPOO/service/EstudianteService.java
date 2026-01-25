package com.example.ProyectoExamenPOO.service;

import com.example.ProyectoExamenPOO.model.entity.Estudiante;
import com.example.ProyectoExamenPOO.repository.IEstudianteRepository;
import com.example.ProyectoExamenPOO.exception.BadRequestException;
import org.springframework.stereotype.Service;
import com.example.ProyectoExamenPOO.exception.ResourceNotFoundException;

import java.util.List;

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
        return estudianteRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Estudiante no encontrado con ID: " + id));
    }

    @Override
    public void saveEstudiante(Estudiante estudiante) {
        if (estudianteRepository.existsByEmail(estudiante.getEmail())) {
            throw new BadRequestException("El email " + estudiante.getEmail() + " ya está registrado.");
        }
        if (estudianteRepository.existsBydni(estudiante.getDni())) {
            throw new BadRequestException("La cédula " + estudiante.getDni() + " ya está registrada.");
        }
        estudianteRepository.save(estudiante);
    }

    @Override
    public Estudiante findBydni(String dni) {
        return estudianteRepository.findBydni(dni).orElseThrow(() ->
                new ResourceNotFoundException("Estudiante no encontrado con cédula: " + dni));
    }

    @Override
    public void deleteEstudiante(Long id) {
        if (!estudianteRepository.existsById(id)) {
            throw new ResourceNotFoundException("No se puede eliminar: Estudiante no encontrado con ID: " + id);
        }
        estudianteRepository.deleteById(id);
    }

    @Override
    public Estudiante updateEstudiante(Long id, Estudiante datosNuevos) {
        Estudiante estudianteExistente = estudianteRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Estudiante no encontrado con ID: " + id));

        if (datosNuevos.getDni() != null) {
            estudianteExistente.setDni(datosNuevos.getDni());
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