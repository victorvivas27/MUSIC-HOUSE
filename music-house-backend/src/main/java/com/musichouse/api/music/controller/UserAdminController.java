package com.musichouse.api.music.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.musichouse.api.music.dto.dto_entrance.LoginDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.TokenDtoExit;
import com.musichouse.api.music.dto.dto_exit.UserDtoExit;
import com.musichouse.api.music.dto.dto_modify.UserDtoModify;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.security.JwtService;
import com.musichouse.api.music.service.userAdmin.UserServiceAdmin;
import com.musichouse.api.music.util.ApiResponse;
import com.musichouse.api.music.util.FileValidatorImage;
import jakarta.mail.MessagingException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Valid;
import jakarta.validation.Validator;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

/**
 * Controlador para la gestión administrativa de usuarios.
 *
 * <p>Incluye operaciones de login, lectura, búsqueda, actualización y eliminación de usuarios
 * por parte de administradores del sistema.</p>
 * <p>
 * Endpoints principales:
 * - POST /login: Autenticación y emisión de cookie JWT.
 * - GET /: Listado paginado de usuarios.
 * - GET /{idUser}: Obtener usuario por ID.
 * - PUT /: Actualizar usuario desde el panel admin.
 * - DELETE /{idUser}: Eliminar usuario.
 * - GET /search: Buscar usuario por nombre.
 * <p>
 * Requiere roles con privilegios administrativos.
 */
@RestController
@AllArgsConstructor
@RequestMapping("/api/users")
public class UserAdminController {
    private final static Logger LOGGER = LoggerFactory.getLogger(UserAdminController.class);
    private final UserServiceAdmin userService;
    private final ObjectMapper objectMapper;
    private final Validator validator;
    private final JwtService jwtService;

    /**
     * Endpoint de inicio de sesión para usuarios.
     *
     * <p>Valida credenciales y devuelve un JWT embebido en una cookie HttpOnly.</p>
     *
     * @param loginDtoEntrance
     *         Credenciales de acceso (email y contraseña).
     *
     * @return Token encapsulado en la respuesta junto con la cookie, o error de autenticación.
     *
     * @throws ResourceNotFoundException
     *         si el usuario no existe o no verificó su email.
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<TokenDtoExit>> loginUser(@Valid @RequestBody LoginDtoEntrance loginDtoEntrance)
            throws ResourceNotFoundException {
        try {
            TokenDtoExit tokenDtoExit = userService.loginUserAndCheckEmail(loginDtoEntrance);

            return ResponseEntity.ok(

                    ApiResponse.<TokenDtoExit>builder()
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

    /**
     * Obtiene una lista paginada de todos los usuarios registrados.
     *
     * @param pageable
     *         Información de paginación y orden.
     *
     * @return Página con usuarios y metainformación de la respuesta.
     */
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

    /**
     * Obtiene los datos de un usuario a partir de su UUID.
     *
     * @param idUser
     *         UUID del usuario a buscar.
     *
     * @return Datos del usuario si es encontrado.
     *
     * @throws ResourceNotFoundException
     *         si el usuario no existe.
     */
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

    /**
     * Actualiza los datos de un usuario desde el panel de administración.
     *
     * <p>Se espera un JSON como string en el parámetro `user`, y una imagen opcional.</p>
     *
     * @param userJson
     *         JSON serializado con los campos a modificar (UserDtoModify).
     * @param file
     *         Imagen de perfil opcional.
     *
     * @return Usuario actualizado o errores de validación.
     *
     * @throws JsonProcessingException
     *         si falla el parseo del JSON.
     * @throws MessagingException
     *         si ocurre un error de envío de email.
     * @throws ResourceNotFoundException
     *         si el usuario no se encuentra.
     */
    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public HttpEntity<ApiResponse<UserDtoExit>> updateUser(
            @RequestParam("user") String userJson,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) throws JsonProcessingException, MessagingException, ResourceNotFoundException {
        UserDtoModify userDtoModify = objectMapper.readValue(userJson, UserDtoModify.class);
        List<String> fileErrors = FileValidatorImage.validateImage(file);
        Set<ConstraintViolation<UserDtoModify>> violations = validator.validate(userDtoModify);
        List<String> dtoErrors = violations.stream()
                .map(v ->
                        v.getPropertyPath() + ": " + v.getMessage())
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


    /**
     * Elimina un usuario según su ID.
     *
     * @param idUser
     *         UUID del usuario a eliminar.
     *
     * @return Confirmación de eliminación.
     *
     * @throws ResourceNotFoundException
     *         si el usuario no existe.
     */
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

    /**
     * Busca usuarios por nombre de forma paginada.
     *
     * @param name
     *         Nombre o fragmento de nombre a buscar.
     * @param pageable
     *         Información de paginación.
     *
     * @return Lista de usuarios cuyo nombre coincida parcial o totalmente.
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<UserDtoExit>>> searchUserByName(
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