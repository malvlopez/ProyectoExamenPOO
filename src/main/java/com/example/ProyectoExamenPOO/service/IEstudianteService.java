package com.example.ProyectoExamenPOO.service;

import com.example.ProyectoExamenPOO.model.entity.Estudiante;

import java.util.List;

public interface IEstudianteService {
    public List<Estudiante> getEstudiante();
    public Estudiante findEstudiante(Long id);
    public void saveEstudiante(Estudiante estudiante);
    public void deleteEstudiante(Long id);
    public Estudiante updateEstudiante(Long id, Estudiante datosNuevos);
}
