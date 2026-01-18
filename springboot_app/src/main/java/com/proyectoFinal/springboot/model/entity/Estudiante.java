package com.proyectoFinal.springboot.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

@Entity
@Data
public class Estudiante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 2, max = 50)
    private String nombre;

    @NotBlank
    @Email
    private String email;

    @NotNull
    @Min(16)
    @Max(60)
    private Integer edad;

    @NotBlank
    private String carrera;
}