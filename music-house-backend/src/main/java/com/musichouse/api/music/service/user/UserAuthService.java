package com.musichouse.api.music.service.user;

import com.musichouse.api.music.dto.dto_exit.TokenDtoExit;
import com.musichouse.api.music.entity.User;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.repository.UserRepository;
import com.musichouse.api.music.security.JwtService;
import com.musichouse.api.music.service.cookieService.CookieService;
import com.musichouse.api.music.service.userAdmin.UserBuilder;
import com.musichouse.api.music.service.userAdmin.UserValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserAuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final CookieService cookieService;
    private final UserValidator userValidator;
    private final UserBuilder userBuilder;

    public TokenDtoExit verifyUser(String email, String code) throws ResourceNotFoundException {
        User user = userValidator.validateUserExistsByEmail(email);

        if (user.isVerified()) {
            throw new IllegalStateException("La cuenta ya fue verificada.");
        }

        if (!code.equals(user.getVerificationCode())) {
            throw new IllegalArgumentException("El código de verificación es incorrecto.");
        }

        if (user.getVerificationExpiry() != null &&
                user.getVerificationExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("El código de verificación ha expirado.");
        }

        user.setVerified(true);
        user.setVerificationCode(null);
        user.setVerificationExpiry(null);
        userRepository.save(user);

        String token = jwtService.generateToken(user);

        TokenDtoExit tokenDtoExit = userBuilder.fromUserExit(user, token);

        return tokenDtoExit;
    }
}
