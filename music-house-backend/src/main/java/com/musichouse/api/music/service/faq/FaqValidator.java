package com.musichouse.api.music.service.faq;

import com.musichouse.api.music.entity.FAQ;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.repository.FaqRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@AllArgsConstructor
public class FaqValidator {
    private final FaqRepository faqRepository;

    public FAQ validateFaqId(UUID idFaq) throws ResourceNotFoundException {
        return faqRepository.findById(idFaq)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Faq con ID " + idFaq + " no encontrada"));
    }

    public void validateIsActive(FAQ faq) throws ResourceNotFoundException {
        if (!faq.isActive()) {
            throw new ResourceNotFoundException("La pregunta no está disponible públicamente.");
        }
    }
}
