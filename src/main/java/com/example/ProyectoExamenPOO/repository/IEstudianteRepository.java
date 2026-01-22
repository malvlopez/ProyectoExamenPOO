package com.example.ProyectoExamenPOO.repository;

import com.example.ProyectoExamenPOO.model.entity.Estudiante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface IEstudianteRepository extends JpaRepository<Estudiante, Long> {

    boolean existsByEmail(String email);
    boolean existsBydni(String dni);

    Optional<Estudiante> findBydni(String dni);
}