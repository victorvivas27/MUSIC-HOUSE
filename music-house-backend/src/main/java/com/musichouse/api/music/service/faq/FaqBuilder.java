package com.musichouse.api.music.service.faq;

import com.musichouse.api.music.dto.dto_entrance.FaqDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.FaqDtoExit;
import com.musichouse.api.music.dto.dto_modify.FaqDtoModify;
import com.musichouse.api.music.entity.FAQ;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@AllArgsConstructor
public class FaqBuilder {
    private final FaqValidator faqValidator;

    public FAQ fromDto(FaqDtoEntrance faqDtoEntrance) {
        return FAQ.builder()
                .question(faqDtoEntrance.getQuestion())
                .answer("CONTESTAR LA PREGUNTA")
                .build();

    }

    public FaqDtoExit fromDtoExit(FAQ faq) {
        return FaqDtoExit.builder()
                .idFaq(faq.getIdFaq())
                .question(faq.getQuestion())
                .answer(faq.getAnswer())
                .isActive(faq.isActive())
                .registDate(faq.getRegistDate())
                .modifiedDate(faq.getModifiedDate())
                .build();
    }

    public FAQ fromDtoModify(FaqDtoModify dto) throws ResourceNotFoundException {
        FAQ existingFaq = faqValidator.validateFaqId(dto.getIdFaq());
        return FAQ.builder()
                .idFaq(existingFaq.getIdFaq())
                .question(existingFaq.getQuestion())
                .answer(dto.getAnswer())
                .isActive(dto.isActive())
                .registDate(existingFaq.getRegistDate())
                .modifiedDate(LocalDateTime.now())
                .build();
    }
}
