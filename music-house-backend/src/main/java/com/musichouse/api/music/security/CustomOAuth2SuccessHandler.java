package com.musichouse.api.music.security;

import com.musichouse.api.music.MusicHouseApplication;
import com.musichouse.api.music.entity.User;
import com.musichouse.api.music.service.user.UserService;
import com.musichouse.api.music.strategy.OAuth2UserInfoStrategyFactory;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {
    private static final Logger LOGGER = LoggerFactory.getLogger(CustomOAuth2SuccessHandler.class);
    private final JwtService jwtService;
    private final UserService userService;
    private final OAuth2UserInfoStrategyFactory strategyFactory;

    @Value("${frontend.redirect.url}")
    private String redirectUrl;

    public CustomOAuth2SuccessHandler(
            JwtService jwtService,
            @Lazy UserService userService,
            OAuth2UserInfoStrategyFactory strategyFactory
    ) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.strategyFactory = strategyFactory;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException {
        LOGGER.info("✅ Inicio de autenticación OAuth2 exitosa.");
        OAuth2AuthenticationToken authToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String provider = authToken.getAuthorizedClientRegistrationId();
        LOGGER.info("Proveedor OAuth detectado: {}", provider);
        var strategy = strategyFactory.getStrategy(provider);
        String email = strategy.getEmail(oAuth2User, authToken);
        String name = strategy.getName(oAuth2User);
        String picture = strategy.getPicture(oAuth2User);
        LOGGER.info("Datos del usuario obtenidos: email={}, name={}", email, name);
        if (email == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "No se pudo obtener el email del proveedor.");
            return;
        }

        User user = switch (provider) {
            case "google" -> userService.findOrCreateGoogleUser(email, name, picture);
            case "github" -> userService.findOrCreateGitHubUser(email, name, picture);
            default -> throw new IllegalStateException("Proveedor no soportado: " + provider);
        };

        LOGGER.info("Usuario registrado o existente: {}", user.getEmail());
        userService.evictAllUsersCache();

        // ✅ Generar token JWT
        String token = jwtService.generateToken(user);
        LOGGER.info("JWT generado con éxito. Longitud: {} caracteres", token.length());


        ResponseCookie cookie = ResponseCookie.from("oauth_token", token)
                .path("/")
                .httpOnly(false)   // ⚠️ false porque el front debe leerlo
                .secure(true)     // true si usás HTTPS
                .maxAge(300)       // 5 minutos
                .sameSite("None")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        LOGGER.info("Cookie temporal 'oauth_token' añadida: {}", cookie);

        // ✅ Redirigir al frontend
        String finalRedirect = redirectUrl + "/oauth-success";
        LOGGER.info("Redirigiendo al frontend: {}", finalRedirect);

        response.sendRedirect(finalRedirect);

        LOGGER.info("✅ Proceso OAuth2 finalizado correctamente.");
        response.getHeaderNames().forEach(h -> LOGGER.info("Header: {} = {}", h, response.getHeader(h)));
    }
}