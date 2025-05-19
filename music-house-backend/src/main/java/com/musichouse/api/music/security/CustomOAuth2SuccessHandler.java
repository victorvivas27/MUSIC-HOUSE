package com.musichouse.api.music.security;

import com.musichouse.api.music.entity.User;
import com.musichouse.api.music.service.cookieService.CookieService;
import com.musichouse.api.music.service.user.UserService;
import com.musichouse.api.music.strategy.OAuth2UserInfoStrategyFactory;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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

@Component
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserService userService;
    private final CookieService cookieService;
    private final OAuth2UserInfoStrategyFactory strategyFactory;

    @Value("${frontend.redirect.url}")
    private String redirectUrl;

    public CustomOAuth2SuccessHandler(
            JwtService jwtService,
            @Lazy UserService userService,
            CookieService cookieService,
            OAuth2UserInfoStrategyFactory strategyFactory
    ) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.cookieService = cookieService;
        this.strategyFactory = strategyFactory;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException {

        OAuth2AuthenticationToken authToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String provider = authToken.getAuthorizedClientRegistrationId();

        var strategy = strategyFactory.getStrategy(provider);
        String email = strategy.getEmail(oAuth2User, authToken);
        String name = strategy.getName(oAuth2User);
        String picture = strategy.getPicture(oAuth2User);

        if (email == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "No se pudo obtener el email del proveedor.");
            return;
        }

        User user = switch (provider) {
            case "google" -> userService.findOrCreateGoogleUser(email, name, picture);
            case "github" -> userService.findOrCreateGitHubUser(email, name, picture);
            default -> throw new IllegalStateException("Proveedor no soportado: " + provider);
        };
        userService.evictAllUsersCache();

        String token = jwtService.generateToken(user);
        ResponseCookie cookie = cookieService.generateCookie(token);

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, cookieService.deleteSessionCookie().toString());
        response.sendRedirect(redirectUrl);
    }
}