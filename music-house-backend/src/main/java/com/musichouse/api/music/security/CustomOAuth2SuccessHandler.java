package com.musichouse.api.music.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.musichouse.api.music.entity.User;
import com.musichouse.api.music.service.cookieService.CookieService;
import com.musichouse.api.music.service.user.UserService;
import com.musichouse.api.music.service.userAdmin.UserBuilder;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

@Component
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserService userService;
    private final CookieService cookieService;
    private final UserBuilder userBuilder;
    private final OAuth2AuthorizedClientService authorizedClientService;

    @Value("${frontend.redirect.url}")
    private String redirectUrl;

    public CustomOAuth2SuccessHandler(
            JwtService jwtService,
            @Lazy UserService userService,
            CookieService cookieService,
            UserBuilder userBuilder,
            OAuth2AuthorizedClientService authorizedClientService
    ) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.cookieService = cookieService;
        this.userBuilder = userBuilder;
        this.authorizedClientService = authorizedClientService;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        OAuth2AuthenticationToken authToken = (OAuth2AuthenticationToken) authentication;
        String provider = authToken.getAuthorizedClientRegistrationId(); // "google" o "github"

        String email = null;
        String name = null;
        String picture = null;

        if ("google".equals(provider)) {
            email = oAuth2User.getAttribute("email");
            name = oAuth2User.getAttribute("name");
            picture = oAuth2User.getAttribute("picture");
        } else if ("github".equals(provider)) {
            email = oAuth2User.getAttribute("email");

            if (email == null) {
                OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;

                OAuth2AuthorizedClient authorizedClient = authorizedClientService.loadAuthorizedClient(
                        oauthToken.getAuthorizedClientRegistrationId(),
                        oauthToken.getName()
                );

                String accessToken = authorizedClient.getAccessToken().getTokenValue();

                // Llamada a https://api.github.com/user/emails
                try {
                    HttpClient client = HttpClient.newHttpClient();
                    HttpRequest httpRequest = HttpRequest.newBuilder()
                            .uri(URI.create("https://api.github.com/user/emails"))
                            .header("Authorization", "Bearer " + accessToken)
                            .header("Accept", "application/vnd.github+json")
                            .build();

                    HttpResponse<String> httpResponse = client.send(httpRequest, HttpResponse.BodyHandlers.ofString());

                    if (httpResponse.statusCode() == 200) {
                        ObjectMapper mapper = new ObjectMapper();
                        List<Map<String, Object>> emails = mapper.readValue(httpResponse.body(), List.class);

                        for (Map<String, Object> emailEntry : emails) {
                            if (Boolean.TRUE.equals(emailEntry.get("primary")) &&
                                    Boolean.TRUE.equals(emailEntry.get("verified"))) {
                                email = (String) emailEntry.get("email");
                                break;
                            }
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            name = oAuth2User.getAttribute("name");
            if (name == null || name.isBlank()) {
                name = oAuth2User.getAttribute("login");
            }

            picture = oAuth2User.getAttribute("avatar_url");
        }

        if (email == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "No se pudo obtener el email del proveedor.");
            return;
        }

        // Crear usuario si no existe
        User user = switch (provider) {
            case "google" -> userService.findOrCreateGoogleUser(email, name, picture);
            case "github" -> userService.findOrCreateGitHubUser(email, name, picture);
            default -> throw new IllegalStateException("Proveedor OAuth no soportado: " + provider);
        };
        userService.evictAllUsersCache();
        // Generar token y cookie
        String token = jwtService.generateToken(user);
        ResponseCookie cookie = cookieService.generateCookie(token);

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, cookieService.deleteSessionCookie().toString());
        response.sendRedirect(redirectUrl);
    }
}