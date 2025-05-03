package com.musichouse.api.music.controller;

import com.musichouse.api.music.dto.dto_exit.TokenDtoExit;
import com.musichouse.api.music.entity.User;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.security.JwtService;
import com.musichouse.api.music.service.user.UserValidator;
import com.musichouse.api.music.util.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final JwtService jwtService;
    private final UserValidator userValidator;

    @Value("${cookie.secure}")
    private Boolean cookieSecure;

    @Value("${cookie.same-site:Lax}") // por defecto Lax
    private String cookieSameSite;

    /**
     * ✅ Devuelve el usuario autenticado si el token es válido.
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<TokenDtoExit>> getCurrentUser(HttpServletRequest request)
            throws ResourceNotFoundException {
        String token = jwtService.extractJwtFromRequest(request);

        if (token == null || !jwtService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.<TokenDtoExit>builder()
                            .statusCode(HttpStatus.UNAUTHORIZED.value())
                            .message("Token inválido o no presente.")
                            .result(null)
                            .build());
        }

        String email = jwtService.getUsernameFromToken(token);
        User user = userValidator.validateUserExistsByEmail(email);

        TokenDtoExit dto = TokenDtoExit.builder()
                .idUser(user.getIdUser())
                .name(user.getName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .roles(user.getRoles().stream().map(Enum::name).toList())
                .build();

        return ResponseEntity.ok(ApiResponse.<TokenDtoExit>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Usuario autenticado.")
                .result(dto)
                .build());
    }

    /**
     * 🚪 Cierra sesión borrando la cookie del JWT.
     */
    @GetMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletResponse response) {
        ResponseCookie deleteCookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite(cookieSameSite)
                .path("/")
                .maxAge(0) // elimina cookie
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, deleteCookie.toString());

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Sesión cerrada correctamente.")
                .result(null)
                .build());
    }
}

