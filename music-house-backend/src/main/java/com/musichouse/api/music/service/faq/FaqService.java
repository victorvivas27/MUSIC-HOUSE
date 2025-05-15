package com.musichouse.api.music.service.faq;

import com.musichouse.api.music.dto.dto_entrance.FaqDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.FaqDtoExit;
import com.musichouse.api.music.dto.dto_modify.FaqDtoModify;
import com.musichouse.api.music.entity.FAQ;
import com.musichouse.api.music.exception.CategoryAssociatedException;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.repository.FaqRepository;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@AllArgsConstructor
public class FaqService {
    private final FaqRepository faqRepository;
    private final FaqBuilder faqBuilder;
    private final FaqValidator faqValidator;
    private final ModelMapper modelMapper;

    @CacheEvict(value = "faq", allEntries = true)
    public FaqDtoExit FaqCreate(FaqDtoEntrance faqDtoEntrance) {

        FAQ faq = faqBuilder.fromDto(faqDtoEntrance);

        FAQ faqSaved = faqRepository.save(faq);

        return faqBuilder.fromDtoExit(faqSaved);
    }


    // Para usuarios: solo preguntas activas
    @Cacheable(value = "faq", key = "#pageable.pageNumber + '-' + #pageable.pageSize + '-' + #pageable.sort")
    public Page<FaqDtoExit> faqAll(Pageable pageable) {
        return faqRepository.findAllByIsActiveTrue(pageable)
                .map(faqBuilder::fromDtoExit);
    }

    // Para admin: todas las preguntas
    @Cacheable(value = "faq", key = "'admin-' + #pageable.pageNumber + '-' + #pageable.pageSize + '-' + #pageable.sort")
    public Page<FaqDtoExit> getAllFaqsAdmin(Pageable pageable) {
        return faqRepository.findAll(pageable)
                .map(faqBuilder::fromDtoExit);
    }

    @CacheEvict(value = "faq", allEntries = true)
    public void deleteFaq(UUID idFaq)
            throws ResourceNotFoundException, CategoryAssociatedException {

        FAQ faqToDelete = faqValidator.validateFaqId(idFaq);

        faqRepository.deleteById(idFaq);
    }


    @CacheEvict(value = "faq", allEntries = true)
    public FaqDtoExit updateFaq(FaqDtoModify dto) throws ResourceNotFoundException {

        FAQ updatedFaq = faqBuilder.fromDtoModify(dto);

        faqRepository.save(updatedFaq);

        return modelMapper.map(updatedFaq, FaqDtoExit.class);
    }

    @Cacheable(value = "faq", key = "#idFaq")
    public FaqDtoExit getFaqById(UUID idFaq)
            throws ResourceNotFoundException {

        FAQ faq = faqValidator.validateFaqId(idFaq);


        return modelMapper.map(faq, FaqDtoExit.class);
    }
}
