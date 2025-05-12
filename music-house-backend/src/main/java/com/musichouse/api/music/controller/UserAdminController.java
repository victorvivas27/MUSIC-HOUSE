package com.musichouse.api.music.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.musichouse.api.music.dto.dto_entrance.LoginDtoEntrance;
import com.musichouse.api.music.dto.dto_entrance.UserDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.TokenDtoExit;
import com.musichouse.api.music.dto.dto_exit.UserDtoExit;
import com.musichouse.api.music.dto.dto_modify.UserDtoModify;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.security.JwtService;
import com.musichouse.api.music.service.userAdmin.UserServiceAdmin;
import com.musichouse.api.music.util.ApiResponse;
import com.musichouse.api.music.util.FileValidatorImage;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Valid;
import jakarta.validation.Validator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;


@RestController
@RequestMapping("/api/users")
public class UserAdminController {
    private final static Logger LOGGER = LoggerFactory.getLogger(UserAdminController.class);
    private final UserServiceAdmin userService;
    private final ObjectMapper objectMapper;
    private final Validator validator;
    private final JwtService jwtService;
    @Value("${cookie.secure}")
    private Boolean cookieSecure;

    @Value("${cookie.same-site}")
    private String cookieSameSite;

    public UserAdminController(UserServiceAdmin userService, ObjectMapper objectMapper, Validator validator, JwtService jwtService) {
        this.userService = userService;
        this.objectMapper = objectMapper;
        this.validator = validator;
        this.jwtService = jwtService;
    }


    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public HttpEntity<ApiResponse<TokenDtoExit>> createUser(
            @RequestParam("user") String userJson,
            @RequestPart(value = "file", required = false) MultipartFile file,
            HttpServletRequest request // 💡 agregamos el request para inspeccionar cookie
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

        // ✅ Crear usuario y generar token
        TokenDtoExit tokenDtoExit = userService.createUser(userDtoEntrance, file);

        // 💡 Extraer el token de la cookie (si ya hay uno)
        String existingToken = jwtService.extractJwtFromRequest(request);

        if (existingToken != null && jwtService.validateToken(existingToken)) {
            // 🙅 Si ya hay sesión activa, no seteamos cookie nueva (caso admin)
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.<TokenDtoExit>builder()
                            .status(HttpStatus.CREATED)
                            .statusCode(HttpStatus.CREATED.value())
                            .message("Usuario creado con éxito por administrador.")
                            .error(null)
                            .result(tokenDtoExit)
                            .build());
        }

        // ✅ Si no hay sesión, seteamos la cookie (registro normal)
        ResponseCookie cookie = ResponseCookie.from("jwt", tokenDtoExit.getToken())
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite(cookieSameSite)
                .path("/")
                .maxAge(60 * 60)
                .build();

        return ResponseEntity.status(HttpStatus.CREATED)
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(ApiResponse.<TokenDtoExit>builder()
                        .status(HttpStatus.CREATED)
                        .statusCode(HttpStatus.CREATED.value())
                        .message("Usuario creado con éxito.")
                        .error(null)
                        .result(tokenDtoExit)
                        .build());
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<TokenDtoExit>> loginUser(@Valid @RequestBody LoginDtoEntrance loginDtoEntrance)
            throws ResourceNotFoundException {
        try {
            TokenDtoExit tokenDtoExit = userService.loginUserAndCheckEmail(loginDtoEntrance);

            ResponseCookie cookie = ResponseCookie.from("jwt", tokenDtoExit.getToken())
                    .httpOnly(true)
                    .secure(cookieSecure)
                    .sameSite(cookieSameSite)
                    .path("/")
                    .maxAge(60 * 60)
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(ApiResponse.<TokenDtoExit>builder()
                            .status(HttpStatus.OK)
                            .statusCode(HttpStatus.OK.value())
                            .message("Inicio de sesión exitoso.")
                            .error(null)
                            .result(tokenDtoExit)
                            .build());

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.<TokenDtoExit>builder()
                            .status(HttpStatus.UNAUTHORIZED)
                            .statusCode(HttpStatus.UNAUTHORIZED.value())
                            .message("Autenticación fallida. Verifique sus credenciales.")
                            .error(e.getMessage())
                            .result(null)
                            .build());
        }
    }


    // 🔹 OBTENER TODOS LOS USUARIOS
    @GetMapping()
    public ResponseEntity<ApiResponse<Page<UserDtoExit>>> getAllUsers(Pageable pageable) {

        Page<UserDtoExit> userDtoExits = userService.getAllUser(pageable);
        return ResponseEntity.ok(ApiResponse.<Page<UserDtoExit>>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Lista de usuarios obtenida con éxito.")
                .error(null)
                .result(userDtoExits)
                .build());


    }

    // 🔹 OBTENER USUARIO POR ID
    @GetMapping("{idUser}")
    public ResponseEntity<ApiResponse<UserDtoExit>> getUserById(@PathVariable UUID idUser)
            throws ResourceNotFoundException {

        UserDtoExit foundUser = userService.getUserById(idUser);

        return ResponseEntity.ok(ApiResponse.<UserDtoExit>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Usuario encontrado con éxito.")
                .error(null)
                .result(foundUser)
                .build());

    }

    // 🔹 ACTUALIZAR USUARIO
    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public HttpEntity<ApiResponse<UserDtoExit>> updateUser(
            @RequestParam("user") String userJson,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) throws JsonProcessingException, MessagingException, ResourceNotFoundException {


        // 📌 1️⃣ Convertir el JSON String a un objeto UserDtoEntrance
        UserDtoModify userDtoModify = objectMapper.readValue(userJson, UserDtoModify.class);

        // 2. Validar archivos subidos
        List<String> fileErrors = FileValidatorImage.validateImage(file);

        // 3. Validar DTO manualmente (porque viene como JSON string)
        Set<ConstraintViolation<UserDtoModify>> violations = validator.validate(userDtoModify);

        List<String> dtoErrors = violations.stream()
                .map(v ->
                        v.getPropertyPath() + ": " + v.getMessage())
                .toList();

        // 4. Unificar errores
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

        // 5. Crear usuario
        UserDtoExit userDtoExit = userService.updateUser(userDtoModify, file);


        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<UserDtoExit>builder()
                        .status(HttpStatus.OK)
                        .statusCode(HttpStatus.OK.value())
                        .message("Usuario modificado con éxito.")
                        .error(null)
                        .result(userDtoExit)
                        .build());

    }


    // 🔹 ELIMINAR USUARIO
    @DeleteMapping("{idUser}")
    public ResponseEntity<ApiResponse<?>> deleteUser(@PathVariable UUID idUser)
            throws ResourceNotFoundException {

        userService.deleteUser(idUser);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Usuario con ID " + idUser + " eliminado exitosamente.")
                .error(null)
                .result(null)
                .build());


    }

    // 🔹 BUSCAR USUARIO POR NOMBRE
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<UserDtoExit>>> searchThemeByName(
            @RequestParam String name,
            Pageable pageable) {


        Page<UserDtoExit> userDtoExits = userService.searchUserName(name, pageable);

        return ResponseEntity.ok(ApiResponse.<Page<UserDtoExit>>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Búsqueda usuarios por nombre.")
                .error(null)
                .result(userDtoExits)
                .build());


    }
}