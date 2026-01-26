package com.example.ProyectoExamenPOO.service;

import com.example.ProyectoExamenPOO.model.entity.Estudiante;
import com.example.ProyectoExamenPOO.repository.IEstudianteRepository;

import java.util.List;

public interface IEstudianteService {
    List<Estudiante> getEstudiante();
    Estudiante findEstudiante(Long id);
    void saveEstudiante(Estudiante estudiante);
    void deleteEstudiante(Long id);
    Estudiante updateEstudiante(Long id, Estudiante datosNuevos);

    List<Estudiante> findBydni(String dni);
    List<Estudiante> findByName(String texto);
    List<Estudiante> findByCareer(String career);

}