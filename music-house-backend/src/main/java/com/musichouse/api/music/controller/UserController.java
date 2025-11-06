package com.musichouse.api.music.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.musichouse.api.music.dto.dto_entrance.UserDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.TokenDtoExit;
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
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * Controlador REST para la gestión de usuarios en el sistema.
 * Expone endpoints para crear, actualizar y obtener el perfil del usuario autenticado.
 *
 * <p>Los datos se manejan como formularios multipart para incluir archivos (como imágenes de perfil).</p>
 * <p>
 * Endpoints:
 * - POST /api/users: Crear usuario con validación y carga opcional de imagen.
 * - PUT /api/users/me: Actualizar perfil del usuario autenticado.
 * - GET /api/users/me: Obtener datos del perfil autenticado.
 *
 * @author
 */
@RestController
@AllArgsConstructor
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final ObjectMapper objectMapper;
    private final Validator validator;
    private final JwtService jwtService;

    /**
     * Crea un nuevo usuario a partir de un JSON y una imagen opcional.
     *
     * @param userJson JSON como String con los datos del usuario (UserDtoEntrance).
     * @param file     Imagen opcional (MultipartFile) asociada al usuario.
     * @return ResponseEntity con estado HTTP 201 y el usuario creado, o errores de validación.
     * @throws JsonProcessingException si el JSON es inválido.
     * @throws MessagingException      si ocurre un error al enviar el correo de verificación.
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public HttpEntity<ApiResponse<TokenDtoExit>> createUser(
            @RequestParam("user") String userJson,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) throws JsonProcessingException, MessagingException {
        UserDtoEntrance userDtoEntrance = objectMapper.readValue(userJson, UserDtoEntrance.class);
        List<String> fileErrors = FileValidatorImage.validateImage(file);
        Set<ConstraintViolation<UserDtoEntrance>> violations = validator.validate(userDtoEntrance);
        List<String> dtoErrors = violations.stream()
                .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                .toList();
        List<String> allErrors = new ArrayList<>();
        allErrors.addAll(fileErrors);
        allErrors.addAll(dtoErrors);
        if (!allErrors.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.<TokenDtoExit>builder()
                    .status(HttpStatus.BAD_REQUEST)
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .message("Errores de validación")
                    .error(allErrors)
                    .result(null)
                    .build());
        }
        TokenDtoExit tokenDtoExit = userService.createUser(userDtoEntrance, file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<TokenDtoExit>builder()
                        .status(HttpStatus.CREATED)
                        .statusCode(HttpStatus.CREATED.value())
                        .message("Usuario creado con éxito.Verifica tu correo electrónico.")
                        .error(null)
                        .result(tokenDtoExit)
                        .build());
    }


    /**
     * Actualiza el perfil del usuario autenticado usando su token JWT.
     * Los datos vienen como JSON string + imagen opcional.
     *
     * @param userJson JSON como String con los campos modificables del usuario.
     * @param file     Imagen nueva opcional del perfil.
     * @param request  HttpServletRequest usado para extraer el JWT de la cookie.
     * @return ResponseEntity con estado HTTP 200 y los datos actualizados del usuario.
     * @throws JsonProcessingException   si el JSON no puede deserializarse.
     * @throws MessagingException        si ocurre un error en el proceso de email.
     * @throws ResourceNotFoundException si el usuario no es encontrado en base al token.
     */
    @PutMapping("/me")
    public HttpEntity<ApiResponse<UserDtoExit>> updateUser(
            @RequestParam("user") String userJson,
            @RequestPart(value = "file", required = false) MultipartFile file,
            HttpServletRequest request
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
        String token = jwtService.extractJwtFromRequest(request);
        String email = jwtService.extractUsername(token);
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

    /**
     * Devuelve los datos del usuario autenticado según su JWT.
     *
     * @param request HttpServletRequest que contiene la cookie con el token JWT.
     * @return ResponseEntity con los datos del usuario autenticado.
     * @throws ResourceNotFoundException si no se encuentra el usuario.
     */
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
