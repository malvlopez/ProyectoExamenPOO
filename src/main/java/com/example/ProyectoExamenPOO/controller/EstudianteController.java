package com.example.ProyectoExamenPOO.controller;

import com.example.ProyectoExamenPOO.model.entity.Estudiante;
import com.example.ProyectoExamenPOO.service.IEstudianteService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/apiEstudiantes")
public class EstudianteController {
    private final IEstudianteService estudianteService;
    public EstudianteController(IEstudianteService estudianteService) {
        this.estudianteService = estudianteService;
    }

    @GetMapping("/Estudiantes")
    public List<Estudiante> getAll() {
        return estudianteService.getEstudiante();
    }

    @GetMapping("/Estudiantes/{id}")
    public Estudiante getById(@PathVariable Long id) {
        return estudianteService.findEstudiante(id);
    }

    @PostMapping("/Estudiantes")
    public String save(@Valid @RequestBody Estudiante estudiante){
        estudianteService.saveEstudiante(estudiante);
        return "Estudiante creado exitosamente";
    }

    @PatchMapping("/Estudiantes/{id}")
    public Estudiante update(@PathVariable Long id, @Valid @RequestBody Estudiante estudiante){
        return estudianteService.updateEstudiante(id, estudiante);
    }

    @PutMapping("/Estudiantes/{id}")
    public Estudiante updateFull(@PathVariable Long id, @Valid @RequestBody Estudiante estudiante) {
        return estudianteService.updateEstudiante(id, estudiante);
    }

    @DeleteMapping("/Estudiantes/{id}")
    public String delete(@PathVariable Long id){
        estudianteService.deleteEstudiante(id);
        return "Estudiante eliminado";
    }

    @GetMapping("/")
    public String home() {
        return "API Estudiantes funcionando";
    }
}
