package com.example.ProyectoExamenPOO.repository;

import com.example.ProyectoExamenPOO.model.entity.Estudiante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IEstudianteRepository extends JpaRepository<Estudiante, Long> {

    boolean existsByEmail(String email);
    boolean existsBydni(String dni);
     List<Estudiante> findByDniStartingWith(String dni);
    List<Estudiante> findByNameContainingIgnoreCaseAndLastNameContainingIgnoreCase(String name, String lastName);
     List<Estudiante> findByNameStartingWithIgnoreCaseOrLastNameStartingWithIgnoreCase(String name, String lastName);
     List<Estudiante> findByCareerStartingWithIgnoreCase(String career);
}