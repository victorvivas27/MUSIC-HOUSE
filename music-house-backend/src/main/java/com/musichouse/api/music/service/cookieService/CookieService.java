package com.musichouse.api.music.service.cookieService;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class CookieService {

    @Value("${security.cookie.secure}")
    private boolean cookieSecure;

    @Value("${security.cookie.same-site}")
    private String cookieSameSite;

    public ResponseCookie generateCookie(String token) {
        return ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite(cookieSameSite)
                .path("/")
                .maxAge(Duration.ofHours(1))
                .build();
    }
}