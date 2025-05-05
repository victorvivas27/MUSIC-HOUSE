package com.musichouse.api.music.service.user;

import com.musichouse.api.music.dto.dto_exit.UserDtoExit;
import com.musichouse.api.music.dto.dto_modify.UserDtoModify;
import com.musichouse.api.music.entity.User;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.repository.UserRepository;
import com.musichouse.api.music.service.userAdmin.UserBuilder;
import com.musichouse.api.music.service.userAdmin.UserValidator;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@AllArgsConstructor
public class UserService {
    private final UserValidator userValidator;
    private final UserBuilder userBuilder;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

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
}
