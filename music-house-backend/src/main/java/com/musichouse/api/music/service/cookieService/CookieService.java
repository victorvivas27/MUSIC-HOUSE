package com.musichouse.api.music.service.cookieService;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class CookieService {

    // 🧩 Se leen desde application.properties
    @Value("${cookie.secure:true}")
    private boolean cookieSecure;

    @Value("${cookie.same-site:Strict}")
    private String sameSite;

    // Duración estándar (puedes parametrizarla también si querés)
    private static final Duration COOKIE_MAX_AGE = Duration.ofHours(1);

    public ResponseCookie generateCookie(String token) {
        return ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite(sameSite)
                .path("/")
                .maxAge(COOKIE_MAX_AGE)
                .build();
    }

    public ResponseCookie deleteCookie() {
        return ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite(sameSite)
                .path("/")
                .maxAge(0)
                .build();
    }

    public ResponseCookie deleteSessionCookie() {
        return ResponseCookie.from("JSESSIONID", "")
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite(sameSite)
                .path("/")
                .maxAge(0)
                .build();
    }
}