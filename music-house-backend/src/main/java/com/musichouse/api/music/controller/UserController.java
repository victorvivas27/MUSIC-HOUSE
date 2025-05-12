package com.musichouse.api.music.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.musichouse.api.music.dto.dto_exit.UserDtoExit;
import com.musichouse.api.music.dto.dto_modify.UserDtoModify;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.security.JwtService;
import com.musichouse.api.music.service.user.UserService;
import com.musichouse.api.music.util.ApiResponse;
import com.musichouse.api.music.util.FileValidatorImage;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@RestController
@AllArgsConstructor
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final ObjectMapper objectMapper;
    private final Validator validator;
    private final JwtService jwtService;

    // 🔹 ACTUALIZAR USUARIO
    @PutMapping("/me") // Aclaramos que este es el endpoint de usuario común
    public HttpEntity<ApiResponse<UserDtoExit>> updateUser(
            @RequestParam("user") String userJson,
            @RequestPart(value = "file", required = false) MultipartFile file,
            HttpServletRequest request // 💡 esto es lo que te permite sacar el token
    ) throws JsonProcessingException, MessagingException, ResourceNotFoundException {

        UserDtoModify userDtoModify = objectMapper.readValue(userJson, UserDtoModify.class);

        List<String> fileErrors = FileValidatorImage.validateImage(file);
        Set<ConstraintViolation<UserDtoModify>> violations = validator.validate(userDtoModify);
        List<String> dtoErrors = violations.stream()
                .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                .toList();

        List<String> allErrors = new ArrayList<>();
        allErrors.addAll(fileErrors);
        allErrors.addAll(dtoErrors);

        if (!allErrors.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.<UserDtoExit>builder()
                    .status(HttpStatus.BAD_REQUEST)
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .message("Errores de validación")
                    .error(allErrors)
                    .result(null)
                    .build());
        }

        // ✅ Extraer email desde el token (necesitás tener jwtService inyectado)
        String token = jwtService.extractJwtFromRequest(request);
        String email = jwtService.extractUsername(token);

        // ✅ Llamada correcta al servicio
        UserDtoExit userDtoExit = userService.updateOwnProfile(email, userDtoModify, file);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<UserDtoExit>builder()
                        .status(HttpStatus.OK)
                        .statusCode(HttpStatus.OK.value())
                        .message("Usuario modificado con éxito.")
                        .error(null)
                        .result(userDtoExit)
                        .build());
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDtoExit>> getCurrentUser(HttpServletRequest request)
            throws ResourceNotFoundException {

        String token = jwtService.extractJwtFromRequest(request);
        String email = jwtService.extractUsername(token);

        UserDtoExit userDtoExit = userService.getUserByEmail(email);

        return ResponseEntity.ok(ApiResponse.<UserDtoExit>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Usuario obtenido con éxito.")
                .result(userDtoExit)
                .build());
    }
}
