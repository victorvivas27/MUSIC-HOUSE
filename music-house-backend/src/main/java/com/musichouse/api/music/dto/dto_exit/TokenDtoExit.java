package com.musichouse.api.music.dto.dto_exit;

import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TokenDtoExit {

    private UUID idUser;

    private String email;

    private String name;

    private String lastName;

    private List<String> roles;

    private String token;

    private String picture;

    @Builder.Default
    private String tokenType = "Bearer ";

    public TokenDtoExit(UUID idUser, String token) {
        this.idUser = idUser;


        this.token = token;
        this.tokenType = "Bearer ";
    }
}