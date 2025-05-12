package com.musichouse.api.music.dto.dto_exit;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FaqDtoExit {

    private UUID idFaq;

    private String question;

    private String answer;

    private boolean isActive;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "America/Santiago")
    private LocalDateTime registDate;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "America/Santiago")
    private LocalDateTime modifiedDate;


    // Getter personalizado para el formato "¿Pregunta?"
    public String getQuestion() {
        if (question == null || question.trim().isEmpty()) {
            return question; // o devolver "¿?" si prefieres
        }

        String trimmedQuestion = question.trim();

        // Elimina signos existentes al inicio/final para evitar duplicados
        if (trimmedQuestion.startsWith("¿")) {
            trimmedQuestion = trimmedQuestion.substring(1);
        }
        if (trimmedQuestion.endsWith("?")) {
            trimmedQuestion = trimmedQuestion.substring(0, trimmedQuestion.length() - 1);
        }

        // Añade "¿" al inicio y "?" al final
        return "¿" + trimmedQuestion + "?";
    }
}
