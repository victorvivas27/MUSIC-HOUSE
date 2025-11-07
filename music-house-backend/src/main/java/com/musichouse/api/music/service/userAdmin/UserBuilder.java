package com.musichouse.api.music.service.userAdmin;

import com.musichouse.api.music.dto.dto_entrance.UserDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.TokenDtoExit;
import com.musichouse.api.music.entity.Roles;
import com.musichouse.api.music.entity.User;
import com.musichouse.api.music.service.ImageCleaner;
import com.musichouse.api.music.service.awss3Service.AWSS3Service;
import com.musichouse.api.music.util.Constans;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Component
@AllArgsConstructor
public class UserBuilder {
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final ImageCleaner imageCleaner;
    private final AWSS3Service awss3Service;


    public User buildUserWithImage(UserDtoEntrance userDtoEntrance, UUID id, String imageUrl) {
        User user = modelMapper.map(userDtoEntrance, User.class);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setIdUser(id);
        user.setPicture(imageUrl);
        Set<Roles> roles = userDtoEntrance.getRoles() != null && !userDtoEntrance.getRoles().isEmpty()
                ? new HashSet<>(userDtoEntrance.getRoles())
                : Set.of(Roles.USER);
        user.setRoles(roles);
        //user.setTelegramChatId(userDtoEntrance.getTelegramChatId());
        user.getAddresses().forEach(address -> address.setUser(user));
        user.getPhones().forEach(phone -> phone.setUser(user));
        return user;
    }

    public User updateUserImageIfPresent(User userToUpdate, MultipartFile file) {
        if (file != null && !file.isEmpty()) {
            String currentImage = userToUpdate.getPicture();

            // Solo eliminar si NO es la imagen por defecto
            if (currentImage != null && !currentImage.equals(Constans.IMAGEN_DEFAULT)) {
                imageCleaner.deleteImageFromS3(currentImage);
            }

            String newPicture = awss3Service.uploadSingleFile(file, "usuarios/" + userToUpdate.getIdUser());
            userToUpdate.setPicture(newPicture);
        }

        return userToUpdate;
    }

    public TokenDtoExit fromUserExit(User user, String token) {
        return TokenDtoExit.builder()
                .idUser(user.getIdUser())
                .name(user.getName())
                .lastName(user.getLastName())
                .picture(user.getPicture())
                .email(user.getEmail())
                .roles(user.getRoles().stream().map(Enum::name).toList())
                .token(token)
                .build();
    }

    /**
     * Variante de utilidad que no requiere token (lo deja como null).
     */
    public TokenDtoExit fromUserExit(User user) {
        return fromUserExit(user, null);
    }


    public User buildOAuthUser(String email, String fullName, String pictureUrl, String provider) {
        String[] parts = fullName != null ? fullName.trim().split(" ", 2) : new String[0];
        String name = parts.length > 0 ? parts[0] : "Usuario";
        String lastName = parts.length > 1 ? parts[1] : provider;
        return User.builder()
                .idUser(UUID.randomUUID())
                .email(email)
                .name(name)
                .lastName(lastName)
                .picture(pictureUrl)
                .verified(true)
                .roles(Set.of(Roles.USER))
                .password(UUID.randomUUID().toString()) // random password, not used
                .build();
    }


}
