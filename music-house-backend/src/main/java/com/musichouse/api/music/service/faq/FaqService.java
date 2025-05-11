package com.musichouse.api.music.service.faq;

import com.musichouse.api.music.dto.dto_entrance.FaqDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.FaqDtoExit;
import com.musichouse.api.music.entity.FAQ;
import com.musichouse.api.music.repository.FaqRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class FaqService {
    private final FaqRepository faqRepository;
    private final FaqBuilder faqBuilder;

    public FaqDtoExit FaqCreate(FaqDtoEntrance faqDtoEntrance) {

        FAQ faq = faqBuilder.fromDto(faqDtoEntrance);

        FAQ faqSaved = faqRepository.save(faq);

        return faqBuilder.fromDtoExit(faqSaved);
    }
}
