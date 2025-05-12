package com.musichouse.api.music.service.feedback;

import com.musichouse.api.music.dto.dto_entrance.FeedbackDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.FeedbackDtoExit;
import com.musichouse.api.music.entity.Feedback;
import com.musichouse.api.music.entity.User;
import com.musichouse.api.music.exception.CategoryAssociatedException;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.repository.FeedbackRepository;
import com.musichouse.api.music.service.userAdmin.UserValidator;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@AllArgsConstructor
public class FeedbackService {
    private final FeedbackRepository feedbackRepository;
    private final ModelMapper modelMapper;
    private final UserValidator userValidator;
    private final FeedbackValidator feedbackValidator;
    private final FeedbackBuilder feedbackBuilder;

    @CacheEvict(value = "feedbacks", allEntries = true)
    public FeedbackDtoExit userAddFeedback(FeedbackDtoEntrance feedbackDtoEntrance) throws ResourceNotFoundException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();


        User user = userValidator.validateUserExistsByEmail(email);

        //feedbackValidator.feedbackExistByUser(user);

        Feedback feedback = feedbackBuilder.fromDto(feedbackDtoEntrance, user);

        Feedback feedbackSaved = feedbackRepository.save(feedback);

        return feedbackBuilder.fromDtoExit(feedbackSaved);
    }


    @Cacheable(value = "feedback", key = "#pageable.pageNumber + '-' + #pageable.pageSize + '-' + #pageable.sort")
    public Page<FeedbackDtoExit> feedbackAll(Pageable pageable) {

        Page<Feedback> feedbackPage = feedbackRepository.findAll(pageable);

        return feedbackPage.map(feedbackBuilder::fromDtoExit);
    }


    @CacheEvict(value = "feedback", allEntries = true)
    public void deleteFeedback(UUID idFeedback)
            throws ResourceNotFoundException, CategoryAssociatedException {

        Feedback feedbackToDelete = feedbackValidator.validateFeedbackId(idFeedback);

        feedbackRepository.deleteById(idFeedback);
    }


}
