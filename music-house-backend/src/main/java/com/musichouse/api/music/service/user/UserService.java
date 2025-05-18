package com.musichouse.api.music.service.user;

import com.musichouse.api.music.dto.dto_entrance.UserDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.TokenDtoExit;
import com.musichouse.api.music.dto.dto_exit.UserDtoExit;
import com.musichouse.api.music.dto.dto_modify.UserDtoModify;
import com.musichouse.api.music.entity.Roles;
import com.musichouse.api.music.entity.User;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.infra.MailManager;
import com.musichouse.api.music.repository.AddressRepository;
import com.musichouse.api.music.repository.FavoriteRepository;
import com.musichouse.api.music.repository.PhoneRepository;
import com.musichouse.api.music.repository.UserRepository;
import com.musichouse.api.music.security.JwtService;
import com.musichouse.api.music.service.awss3Service.AWSS3Service;
import com.musichouse.api.music.service.awss3Service.S3FileDeleter;
import com.musichouse.api.music.service.userAdmin.AuthHelper;
import com.musichouse.api.music.service.userAdmin.EmailService;
import com.musichouse.api.music.service.userAdmin.UserBuilder;
import com.musichouse.api.music.service.userAdmin.UserValidator;
import com.musichouse.api.music.telegramchat.TelegramService;
import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserService {
    private final UserValidator userValidator;
    private final UserBuilder userBuilder;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final AddressRepository addressRepository;
    private final PhoneRepository phoneRepository;
    private final TelegramService telegramService;
    private final FavoriteRepository favoriteRepository;
    private final AWSS3Service awss3Service;
    private final S3FileDeleter s3FileDeleter;
    private final EmailService emailService;
    private final AuthHelper authHelper;
    @Autowired
    private final MailManager mailManager;


    @Transactional
    @CacheEvict(value = "users", allEntries = true)
    public TokenDtoExit createUser(UserDtoEntrance userDtoEntrance, MultipartFile file)
            throws DataIntegrityViolationException, MessagingException {


        userValidator.validateUniqueEmail(userDtoEntrance);


        UUID id = UUID.randomUUID();
        String imageUrl;

        if (file != null && !file.isEmpty()) {
            imageUrl = awss3Service.uploadFileToS3User(file, id);
        } else {
            imageUrl = awss3Service.copyDefaultUserImage(id);
        }

        User user = userBuilder.buildUserWithImage(userDtoEntrance, id, imageUrl);

        String code = String.valueOf((int) (Math.random() * 900000) + 100000);

        LocalDateTime expiry = LocalDateTime.now().plusMinutes(15);

        user.setVerified(false);

        user.setVerificationCode(code);

        user.setVerificationExpiry(expiry);

        User userSaved = userRepository.save(user);

        //String token = jwtService.generateToken(userSaved);


        try {

            emailService.sendVerificationEmail(user, code);
        } catch (MessagingException e) {
            throw new MessagingException(
                    "No se pudo enviar el correo de bienvenida a " + userSaved.getEmail(), e);
        }


        TokenDtoExit tokenDtoExit = userBuilder.fromUserExit(user);

        return tokenDtoExit;
    }


    @CachePut(value = "users", key = "#email")
    public UserDtoExit updateOwnProfile(String email, UserDtoModify dto, MultipartFile file)
            throws ResourceNotFoundException {

        User userToUpdate = userValidator.validateUserExistsByEmail(email);

        if (dto.getName() != null) {
            userToUpdate.setName(dto.getName());
        }
        if (dto.getLastName() != null) {
            userToUpdate.setLastName(dto.getLastName());
        }

        userToUpdate.normalizeData();

        userBuilder.updateUserImageIfPresent(userToUpdate, file);

        userRepository.save(userToUpdate);

        return modelMapper.map(userToUpdate, UserDtoExit.class);
    }

    @Cacheable(value = "users", key = "#email")
    public UserDtoExit getUserByEmail(String email) throws ResourceNotFoundException {
        User user = userValidator.validateUserExistsByEmail(email);
        return modelMapper.map(user, UserDtoExit.class);
    }

    public User findOrCreateGoogleUser(String email, String fullName, String picture) {

        return userRepository.findByEmail(email)
                .orElseGet(() -> createGoogleUser(email, fullName, picture));
    }

    private User createGoogleUser(String email, String fullName, String picture) {

        String[] parts = fullName.trim().split(" ", 2);

        String name = parts.length > 0 ? parts[0] : "Usuario";

        String lastName = parts.length > 1 ? parts[1] : "Google";

        return userRepository.save(User.builder()
                .idUser(UUID.randomUUID())
                .email(email)
                .name(name)
                .lastName(lastName)
                .picture(picture)
                .verified(true)
                .roles(Set.of(Roles.USER))
                .password(UUID.randomUUID().toString())
                .build());
    }

    public User findOrCreateGitHubUser(String email, String fullName, String avatarUrl) {
        return userRepository.findByEmail(email)
                .orElseGet(() -> createGitHubUser(email, fullName, avatarUrl));
    }

    private User createGitHubUser(String email, String fullName, String avatarUrl) {
        String[] parts = fullName.trim().split(" ", 2);
        String name = parts.length > 0 ? parts[0] : "Usuario";
        String lastName = parts.length > 1 ? parts[1] : "GitHub";

        return userRepository.save(User.builder()
                .idUser(UUID.randomUUID())
                .email(email)
                .name(name)
                .lastName(lastName)
                .picture(avatarUrl)
                .verified(true)
                .roles(Set.of(Roles.USER))
                .password(UUID.randomUUID().toString())
                .build());
    }

    @CacheEvict(value = "users", allEntries = true)
    public void evictAllUsersCache() {
        // Método vacío, sólo para invalidar la lista paginada de usuarios.
    }

  
}
