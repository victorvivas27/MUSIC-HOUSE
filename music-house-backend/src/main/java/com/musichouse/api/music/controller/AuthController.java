package com.musichouse.api.music.controller;

import com.musichouse.api.music.dto.dto_entrance.VerifyRequest;
import com.musichouse.api.music.dto.dto_exit.JwtResponse;
import com.musichouse.api.music.dto.dto_exit.TokenDtoExit;
import com.musichouse.api.music.entity.User;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.security.JwtService;
import com.musichouse.api.music.service.user.UserAuthService;
import com.musichouse.api.music.service.user.UserService;
import com.musichouse.api.music.service.userAdmin.UserBuilder;
import com.musichouse.api.music.service.userAdmin.UserValidator;
import com.musichouse.api.music.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador encargado de manejar la autenticación y verificación de usuarios.
 *
 * <p>Incluye endpoints para:</p>
 * <ul>
 *     <li>Verificar cuenta con código de activación</li>
 *     <li>Consultar el usuario autenticado mediante token JWT</li>
 *     <li>Cerrar sesión eliminando la cookie JWT</li>
 * </ul>
 *
 * <p>Este controlador trabaja con cookies HttpOnly para mejorar la seguridad del token JWT.</p>
 * <p>
 * Endpoints:
 * - GET /api/auth/me
 * - POST /api/auth/verify
 * - GET /api/auth/logout
 *
 * @author
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final JwtService jwtService;
    private final UserValidator userValidator;
    private final UserAuthService authService;
    private final UserBuilder userBuilder;
    private final UserService userService;

    /**
     * Retorna información del usuario actualmente autenticado a partir del JWT en la cookie.
     *
     * @param request
     *         HttpServletRequest desde donde se extrae el token JWT.
     *
     * @return ResponseEntity con los datos básicos del usuario autenticado o error si el token es inválido.
     *
     * @throws ResourceNotFoundException
     *         si el usuario no se encuentra en la base de datos.
     */
    public ResponseEntity<ApiResponse<TokenDtoExit>> getCurrentUser(@RequestHeader("Authorization") String authHeader)
            throws ResourceNotFoundException {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.<TokenDtoExit>builder()
                            .statusCode(HttpStatus.UNAUTHORIZED.value())
                            .message("Token no presente o inválido.")
                            .result(null)
                            .build());
        }

        String token = authHeader.substring(7);

        if (!jwtService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.<TokenDtoExit>builder()
                            .statusCode(HttpStatus.UNAUTHORIZED.value())
                            .message("Token inválido o expirado.")
                            .result(null)
                            .build());
        }

        String email = jwtService.getUsernameFromToken(token);
        User user = userValidator.validateUserExistsByEmail(email);

        TokenDtoExit tokenDtoExit = userBuilder.fromUserExit(user, token);

        return ResponseEntity.ok(ApiResponse.<TokenDtoExit>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Usuario autenticado.")
                .result(tokenDtoExit)
                .build());
    }

    /**
     * Cierra la sesión del usuario autenticado.
     *
     * <p>Este método genera una cookie con duración 0 (maxAge = 0),
     * lo que en práctica elimina la cookie `jwt` del navegador.</p>
     *
     * @param response
     *         HttpServletResponse donde se añade la cabecera para eliminar la cookie.
     *
     * @return Confirmación de que la sesión fue cerrada exitosamente.
     */
    @GetMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Sesión cerrada correctamente (frontend debe eliminar el token).")
                .result(null)
                .build());
    }

    /**
     * Verifica una cuenta de usuario mediante email y código enviado.
     *
     * <p>Una vez verificado, genera un JWT y lo devuelve embebido en una cookie HttpOnly.</p>
     *
     * @param request
     *         Objeto que contiene el email y el código de verificación.
     *
     * @return TokenDtoExit con datos del usuario autenticado y cookie JWT seteada.
     *
     * @throws ResourceNotFoundException
     *         si el usuario no se encuentra o el código es inválido.
     */
    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<JwtResponse>> verifyUser(@Valid @RequestBody VerifyRequest request)
            throws ResourceNotFoundException {

        TokenDtoExit tokenDtoExit = authService.verifyUser(request.getEmail(), request.getCode());

        JwtResponse jwtResponse = JwtResponse.builder()
                .token(tokenDtoExit.getToken())
                .build();

        return ResponseEntity.ok(
                ApiResponse.<JwtResponse>builder()
                        .status(HttpStatus.OK)
                        .statusCode(HttpStatus.OK.value())
                        .message("Cuenta verificada correctamente.")
                        .result(jwtResponse)
                        .build()
        );
    }


    @GetMapping("/oauth-success")
    public ResponseEntity<ApiResponse<TokenDtoExit>> oauthSuccess(
            @AuthenticationPrincipal OAuth2User oAuth2User) {

        String email = oAuth2User.getAttribute("email");
        String fullName = oAuth2User.getAttribute("name");
        String pictureUrl = oAuth2User.getAttribute("picture");

        User user = userService.findOrCreateGoogleUser(email, fullName, pictureUrl);
        String token = jwtService.generateToken(user);
        TokenDtoExit tokenDtoExit = userBuilder.fromUserExit(user, token);

        return ResponseEntity.ok(ApiResponse.<TokenDtoExit>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Login con Google exitoso.")
                .result(tokenDtoExit)
                .build());
    }
}

