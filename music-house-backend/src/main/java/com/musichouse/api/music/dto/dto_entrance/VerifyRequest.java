package com.musichouse.api.music.dto.dto_entrance;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyRequest {

    @NotBlank(message = "El email es obligatorio.")
    @Email(message = "Formato de email inválido.")
    private String email;

    @NotBlank(message = "El código de verificación es obligatorio.")
    private String code;
}
