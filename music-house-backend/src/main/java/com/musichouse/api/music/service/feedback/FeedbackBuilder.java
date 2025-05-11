package com.musichouse.api.music.service.feedback;

import com.musichouse.api.music.dto.dto_entrance.FeedbackDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.FeedbackDtoExit;
import com.musichouse.api.music.entity.Feedback;
import com.musichouse.api.music.entity.User;
import org.springframework.stereotype.Component;

@Component
public class FeedbackBuilder {

    public Feedback fromDto(FeedbackDtoEntrance feedbackDtoEntrance, User user) {

        return Feedback.builder()
                .rating(feedbackDtoEntrance.getRating())
                .comment(feedbackDtoEntrance.getComment())
                .user(user)
                .build();
    }

    public FeedbackDtoExit fromDtoExit(Feedback feedback) {
        User user = feedback.getUser();

        return FeedbackDtoExit.builder()
                .idFeedback(feedback.getIdFeedback())
                .rating(feedback.getRating())
                .comment(feedback.getComment())
                .idUser(user.getIdUser())
                .name(user.getName())
                .lastName(user.getLastName())
                .picture(user.getPicture())
                .registDate(feedback.getRegistDate())
                .modifiedDate(feedback.getModifiedDate())
                .build();
    }
}
