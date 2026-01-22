package com.example.ProyectoExamenPOO.repository;

import com.example.ProyectoExamenPOO.model.entity.Estudiante;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IEstudianteRepository extends JpaRepository<Estudiante, Long> {

    boolean existsByEmail(String email);
}