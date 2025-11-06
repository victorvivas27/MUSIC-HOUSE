package com.musichouse.api.music.service.userAdmin;

import com.musichouse.api.music.dto.dto_entrance.LoginDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.TokenDtoExit;
import com.musichouse.api.music.dto.dto_exit.UserDtoExit;
import com.musichouse.api.music.dto.dto_modify.UserDtoModify;
import com.musichouse.api.music.entity.User;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.infra.MailManager;
import com.musichouse.api.music.repository.AddressRepository;
import com.musichouse.api.music.repository.FavoriteRepository;
import com.musichouse.api.music.repository.PhoneRepository;
import com.musichouse.api.music.repository.UserRepository;
import com.musichouse.api.music.s3utils.S3UrlParser;
import com.musichouse.api.music.security.JwtService;
import com.musichouse.api.music.service.StringValidator;
import com.musichouse.api.music.service.awss3Service.AWSS3Service;
import com.musichouse.api.music.service.awss3Service.S3FileDeleter;
import com.musichouse.api.music.telegramchat.TelegramService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;


@Service
@AllArgsConstructor
public class UserServiceAdmin {
    private final static Logger LOGGER = LoggerFactory.getLogger(UserServiceAdmin.class);
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final AddressRepository addressRepository;
    private final PhoneRepository phoneRepository;
    private final ModelMapper modelMapper;
    private final TelegramService telegramService;
    private final FavoriteRepository favoriteRepository;
    private final AWSS3Service awss3Service;
    private final S3FileDeleter s3FileDeleter;
    private final UserValidator userValidator;
    private final UserBuilder userBuilder;
    private final EmailService emailService;
    private final AuthHelper authHelper;

    @Autowired
    private final MailManager mailManager;


    public TokenDtoExit loginUserAndCheckEmail(LoginDtoEntrance loginDtoEntrance)
            throws ResourceNotFoundException, AuthenticationException {
        User user = userValidator.validateUserExistsByEmail(loginDtoEntrance.getEmail());
        Authentication authentication = authHelper.authenticate(
                loginDtoEntrance.getEmail(),
                loginDtoEntrance.getPassword()
        );
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtService.generateToken(userDetails);
        TokenDtoExit tokenDtoExit = userBuilder.fromUserExit(user, token);
        return tokenDtoExit;
    }


    @Cacheable(value = "users")
    public Page<UserDtoExit> getAllUser(Pageable pageable) {
        Page<User> usersPage = userRepository.findAll(pageable);
        return usersPage.map(user -> modelMapper.map(user, UserDtoExit.class));
    }


    @Cacheable(value = "users", key = "#idUser")
    public UserDtoExit getUserById(UUID idUser) throws ResourceNotFoundException {
        User user = userValidator.validateUserId(idUser);
        return modelMapper.map(user, UserDtoExit.class);
    }


    @CachePut(value = "users", key = "#userDtoModify.idUser")
    public UserDtoExit updateUser(UserDtoModify userDtoModify, MultipartFile file)
            throws ResourceNotFoundException {
        User userToUpdate = userValidator.validateUserId(userDtoModify.getIdUser());
        userValidator.validateEmailNotTakenOnUpdate(userToUpdate, userDtoModify.getEmail());
        modelMapper.map(userDtoModify, userToUpdate);
        userToUpdate.normalizeData();
        if (userDtoModify.getRoles() != null) {
            userToUpdate.getRoles().clear();
            userToUpdate.getRoles().addAll(userDtoModify.getRoles());
        }
        userValidator.validateUserHasAtLeastOneRole(userToUpdate);
        userBuilder.updateUserImageIfPresent(userToUpdate, file);
        userRepository.save(userToUpdate);
        return modelMapper.map(userToUpdate, UserDtoExit.class);
    }


    @Caching(evict = {
            @CacheEvict(value = "users", key = "#idUser"),
            @CacheEvict(value = "favorites", key = "#idUser"),
            @CacheEvict(value = "addresses", key = "#idUser"),
            @CacheEvict(value = "phones", key = "#idUser"),
            @CacheEvict(value = "users", allEntries = true)

    })
    public void deleteUser(UUID idUser) throws ResourceNotFoundException {
        User user = userValidator.validateUserId(idUser);
        String imageUrl = user.getPicture();
        favoriteRepository.deleteByIdUser(idUser);
        user.getRoles().clear();
        userRepository.save(user);
        userRepository.delete(user);
        if (imageUrl != null && !imageUrl.isEmpty()) {
            String defaultImageUrl =
                    "https://music-house-local.s3.us-east-1.amazonaws.com/usuario-default.png";

            if (!imageUrl.equals(defaultImageUrl)) {
                String key = S3UrlParser.extractKeyFromS3Url(imageUrl);
                s3FileDeleter.deleteFileFromS3(key);
            }
        }

    }


    @Cacheable(value = "users")
    public Page<UserDtoExit> searchUserName(String name, Pageable pageable)
            throws IllegalArgumentException {
        StringValidator.validateBasicText(name, name);
        Page<User> users = userRepository.findByNameContainingIgnoreCase(name.trim(), pageable);
        return users.map(user -> modelMapper.map(user, UserDtoExit.class));
    }

}
