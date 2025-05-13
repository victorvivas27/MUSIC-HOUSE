package com.musichouse.api.music.dto.dto_entrance;

import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDtoExit {
    private UUID idUser;

    private String email;

    private String name;

    private String lastName;

    private List<String> roles;
}
