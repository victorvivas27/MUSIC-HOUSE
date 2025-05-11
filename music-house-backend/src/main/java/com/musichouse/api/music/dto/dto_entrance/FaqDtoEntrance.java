package com.musichouse.api.music.dto.dto_entrance;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FaqDtoEntrance {

    @NotNull(message = "La pregunta es obligatoria")
    @Size(min = 5, max = 230, message = "La pregunta debe tener entre {min} y {max} caracteres")
    private String question;

    @Size(min = 10, max = 500, message = "La respuesta debe tener entre {min} y {max} caracteres")
    private String answer;

}
