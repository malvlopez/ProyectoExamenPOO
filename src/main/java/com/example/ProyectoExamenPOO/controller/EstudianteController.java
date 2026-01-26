package com.example.ProyectoExamenPOO.controller;

import com.example.ProyectoExamenPOO.exception.ResourceNotFoundException;
import com.example.ProyectoExamenPOO.model.entity.Estudiante;
import com.example.ProyectoExamenPOO.service.IEstudianteService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<Estudiante> getById(@PathVariable Long id) {
        return ResponseEntity.ok(estudianteService.findEstudiante(id));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Estudiante>> search(
            @RequestParam(required = false) String dni,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String carrera) {

        if (dni != null) return ResponseEntity.ok(estudianteService.findBydni(dni));
        if (nombre != null) return ResponseEntity.ok(estudianteService.findByName(nombre));
        if (carrera != null) return ResponseEntity.ok(estudianteService.findByCareer(carrera));

        return ResponseEntity.ok(estudianteService.getEstudiante());
    }

    @PostMapping("/Estudiantes")
    public ResponseEntity<String> save(@Valid @RequestBody Estudiante estudiante){
        estudianteService.saveEstudiante(estudiante);
        return new ResponseEntity<>("Estudiante creado exitosamente", HttpStatus.CREATED);
    }

    @PatchMapping("/Estudiantes/{id}")
    public Estudiante update(@PathVariable Long id, @RequestBody Estudiante estudiante){
        return estudianteService.updateEstudiante(id, estudiante);
    }

    @PutMapping("/Estudiantes/{id}")
    public Estudiante updateFull(@PathVariable Long id, @Valid @RequestBody Estudiante estudiante) {
        return estudianteService.updateEstudiante(id, estudiante);
    }

    @DeleteMapping("/Estudiantes/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        estudianteService.deleteEstudiante(id);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/")
    public String home() {
        return "API Estudiantes funcionando";
    }
}
