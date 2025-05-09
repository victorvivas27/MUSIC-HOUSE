package com.musichouse.api.music.exception;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import com.musichouse.api.music.util.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 🔹 Método Helper para evitar código repetitivo
    private ResponseEntity<ApiResponse<Void>> buildResponse(HttpStatus status, String errorMessage) {
        return ResponseEntity.status(status)
                .body(ApiResponse.<Void>builder()
                        .status(status)
                        .statusCode(status.value())
                        .message(null)
                        .error(errorMessage)
                        .result(null)
                        .build());
    }

    // 🔹 Excepción cuando un recurso no se encuentra
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<ApiResponse<Void>> handleResourceNotFound(ResourceNotFoundException e) {
        return buildResponse(HttpStatus.NOT_FOUND, e.getMessage());
    }

    // 🔹 Manejo de validaciones de Spring (@Valid)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationException(MethodArgumentNotValidException exception) {
        Map<String, String> errors = new HashMap<>();
        exception.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.<Map<String, String>>builder()
                        .status(HttpStatus.BAD_REQUEST)
                        .statusCode(HttpStatus.BAD_REQUEST.value())
                        .message("Algunos campos tienen errores")
                        .error("Revisá los campos resaltados y corregí los datos ingresados")
                        .result(errors)
                        .build());
    }

    // 🔹 Error al mapear datos JSON (estructura incorrecta)
    @ExceptionHandler(JsonMappingException.class)
    public ResponseEntity<ApiResponse<Void>> handleJsonMappingException(JsonMappingException e) {
        return buildResponse(HttpStatus.BAD_REQUEST,
                "No se pudo interpretar la información enviada: " + e.getOriginalMessage());
    }

    // 🔹 Error al leer el cuerpo de la solicitud (por formato inválido)
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        Throwable cause = ex.getCause();

        if (cause instanceof InvalidFormatException invalidFormatException) {
            String field = invalidFormatException.getPath().isEmpty()
                    ? "campo desconocido"
                    : invalidFormatException.getPath().get(0).getFieldName();

            String errorMsg = invalidFormatException.getOriginalMessage() != null
                    ? invalidFormatException.getOriginalMessage()
                    : "El valor enviado no coincide con el formato esperado";

            return buildResponse(
                    HttpStatus.BAD_REQUEST,
                    "Formato inválido en el campo '" + field + "': " + errorMsg
            );
        }

        return buildResponse(HttpStatus.BAD_REQUEST,
                "No se pudo leer el cuerpo de la solicitud. Verificá que los datos enviados sean correctos.");
    }

    // 🔹 Manejo de errores inesperados
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneralException(Exception e) {
        String errorMessage = e.getMessage() != null
                ? e.getMessage()
                : "Ocurrió un error inesperado. Por favor, intentá más tarde.";
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, errorMessage);
    }

    // 🔹 Excepción cuando un email ya existe (puede ser 400 o 409 según prefieras)
    @ExceptionHandler(DuplicateEmailException.class)
    public ResponseEntity<ApiResponse<Void>> handleDuplicateEmailException(DuplicateEmailException e) {
        return buildResponse(HttpStatus.CONFLICT, e.getMessage());
    }

    @ExceptionHandler(DuplicateNameException.class)
    public ResponseEntity<ApiResponse<Void>> handleDuplicateNameException(DuplicateNameException e) {
        return buildResponse(HttpStatus.CONFLICT, e.getMessage());
    }

    // 🔹 Manejo de acceso no autorizado
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<Void>> handleUnauthorizedException(UnauthorizedException e) {
        return buildResponse(HttpStatus.UNAUTHORIZED, e.getMessage());
    }

    // 🔹 Favorito ya existe (ahora usa 409 correctamente)
    @ExceptionHandler(FavoriteAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<Void>> handleFavoriteAlreadyExistsException(FavoriteAlreadyExistsException e) {
        return buildResponse(HttpStatus.CONFLICT, e.getMessage());
    }

    // 🔹 Reservación ya existe
    @ExceptionHandler(ReservationAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<Void>> handleReservationAlreadyExistsException(ReservationAlreadyExistsException e) {
        return buildResponse(HttpStatus.CONFLICT, e.getMessage());
    }

    // 🔹 Duración de la reservación no válida
    @ExceptionHandler(InvalidReservationDurationException.class)
    public ResponseEntity<ApiResponse<Void>> handleInvalidReservationDurationException(InvalidReservationDurationException e) {
        return buildResponse(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    // 🔹 Fecha en el pasado no permitida
    @ExceptionHandler(PastDateException.class)
    public ResponseEntity<ApiResponse<Void>> handlePastDateException(PastDateException e) {
        return buildResponse(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    // 🔹 Archivo no encontrado
    @ExceptionHandler(FileNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleFileNotFoundException(FileNotFoundException e) {
        return buildResponse(HttpStatus.NOT_FOUND, e.getMessage());
    }

    // 🔹 Imagen Duplicada
    @ExceptionHandler(DuplicateImageException.class)
    public ResponseEntity<ApiResponse<Void>> handleFileNotFoundException(DuplicateImageException e) {
        return buildResponse(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    // 🔹 Instrumento Reservado
    @ExceptionHandler(BusinessRuleException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessRuleException(BusinessRuleException e) {
        return buildResponse(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    // 🔹 Feedback User
    @ExceptionHandler(FeedbackAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<Void>> feedbackAlreadyExistsException(FeedbackAlreadyExistsException e) {
        return buildResponse(HttpStatus.CONFLICT, e.getMessage());
    }
}
