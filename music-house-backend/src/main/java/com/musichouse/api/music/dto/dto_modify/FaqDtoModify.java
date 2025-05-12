package com.musichouse.api.music.dto.dto_modify;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.UUID;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class FaqDtoModify {

    @NotNull(message = "El ID del FAQ es obligatorio")
    private UUID idFaq;

    @NotNull(message = "La respuesta es obligatoria")
    @Size(min = 10, max = 500, message = "La respuesta debe tener entre {min} y {max} caracteres")
    private String answer;

    private boolean isActive;

}
