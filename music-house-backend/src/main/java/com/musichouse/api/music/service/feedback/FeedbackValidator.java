package com.musichouse.api.music.service.feedback;

import com.musichouse.api.music.entity.Feedback;
import com.musichouse.api.music.entity.User;
import com.musichouse.api.music.exception.FeedbackAlreadyExistsException;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.repository.FeedbackRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@AllArgsConstructor
public class FeedbackValidator {
    private final FeedbackRepository feedbackRepository;

    public void feedbackExistByUser(User user) {

        if (feedbackRepository.findByUser(user).isPresent()) {

            throw new FeedbackAlreadyExistsException("El usuario ya ha enviado un feedback");
        }
    }

    public Feedback validateFeedbackId(UUID idFeedback) throws ResourceNotFoundException {
        return feedbackRepository.findById(idFeedback)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Feedback con ID " + idFeedback + " no encontrada"));
    }
}
