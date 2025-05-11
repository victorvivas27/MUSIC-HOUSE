package com.musichouse.api.music.service.faq;

import com.musichouse.api.music.dto.dto_entrance.FaqDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.FaqDtoExit;
import com.musichouse.api.music.entity.FAQ;
import org.springframework.stereotype.Component;

@Component
public class FaqBuilder {

    public FAQ fromDto(FaqDtoEntrance faqDtoEntrance) {
        return FAQ.builder()
                .question(faqDtoEntrance.getQuestion())
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
}
