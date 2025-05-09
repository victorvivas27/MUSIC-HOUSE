package com.musichouse.api.music.dto.dto_entrance;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FeedbackDtoEntrance {


    @NotNull(message = "El rating es obligatorio")
    @Min(value = 1, message = "El mínimo de estrellas es 1")
    @Max(value = 5, message = "El máximo de estrellas es 5")
    private Integer rating;

    @NotNull(message = "El comentario no puede ser nulo")
    @Size(min = 10, max = 500, message = "El comentario debe tener entre {min} y {max} caracteres")
    private String comment;
}
