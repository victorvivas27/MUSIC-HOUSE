package com.musichouse.api.music.security;

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
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserService userService;
    private final CookieService cookieService;
    private final UserBuilder userBuilder;
    @Value("${frontend.redirect.url}")
    private String redirectUrl;


    public CustomOAuth2SuccessHandler(
            JwtService jwtService,
            @Lazy UserService userService,
            CookieService cookieService,
            UserBuilder userBuilder
    ) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.cookieService = cookieService;
        this.userBuilder = userBuilder;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");

        String name = oAuth2User.getAttribute("name");

        String picture = oAuth2User.getAttribute("picture");

        User user = userService.findOrCreateGoogleUser(email, name, picture);
        String token = jwtService.generateToken(user);
        ResponseCookie cookie = cookieService.generateCookie(token);

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        response.sendRedirect(redirectUrl);
    }
}