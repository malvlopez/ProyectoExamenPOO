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
    public List<Estudiante> findBydni(String dni) {
        List<Estudiante> estudiantes = estudianteRepository.findByDniStartingWith(dni);
        if (estudiantes.isEmpty()) {
            throw new ResourceNotFoundException("No existen coincidencias con la cédula: " + dni);
        }
        return estudiantes;
    }

    public List<Estudiante> findByName(String texto) {
        String[] partes = texto.trim().split("\\s+");
        List<Estudiante> estudiantes;

        if (partes.length >= 2) {
            estudiantes = estudianteRepository.findByNameContainingIgnoreCaseAndLastNameContainingIgnoreCase(partes[0], partes[1]);

            if (estudiantes.isEmpty()) {
                estudiantes = estudianteRepository.findByNameContainingIgnoreCaseAndLastNameContainingIgnoreCase(partes[1], partes[0]);
            }
        } else {
            estudiantes = estudianteRepository.findByNameStartingWithIgnoreCaseOrLastNameStartingWithIgnoreCase(texto, texto);
        }

        if (estudiantes.isEmpty()) {
            throw new ResourceNotFoundException("No existen estudiantes que coincidan con: " + texto);
        }
        return estudiantes;
    }
    @Override
    public List<Estudiante> findByCareer(String career) {
        List<Estudiante> estudiantes = estudianteRepository.findByCareerStartingWithIgnoreCase(career);
        if (estudiantes.isEmpty()) {
            throw new ResourceNotFoundException("No existen estudiantes de la carrera: " + career);
        }
        return estudiantes;
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