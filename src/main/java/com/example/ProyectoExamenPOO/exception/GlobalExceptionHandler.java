package com.example.ProyectoExamenPOO.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorDetails> handleResourceNotFoundException(ResourceNotFoundException exception, WebRequest webRequest) {
        ErrorDetails errorDetails = new ErrorDetails(
                LocalDateTime.now(),
                exception.getMessage(),
                webRequest.getDescription(false)
        );
        return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
        Map<String, String> errores = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errores.put(error.getField(), error.getDefaultMessage())
        );
        return new ResponseEntity<>(errores, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorDetails> handleDataIntegrity(DataIntegrityViolationException ex, WebRequest request) {
        String message = "Error: El DNI o Correo ya existen.";
        String detailedError = ex.getMostSpecificCause().getMessage().toLowerCase();

        if (detailedError.contains("dni")) {
            message = "El DNI ingresado ya existe en el sistema.";
        } else if (detailedError.contains("email")) {
            message = "El correo electrónico ya está en uso.";
        }

        ErrorDetails errorDetails = new ErrorDetails(
                LocalDateTime.now(),
                message,
                request.getDescription(false)
        );

        return new ResponseEntity<>(errorDetails, HttpStatus.CONFLICT);
    }}