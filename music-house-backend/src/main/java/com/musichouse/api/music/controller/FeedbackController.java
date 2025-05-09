package com.musichouse.api.music.controller;

import com.musichouse.api.music.dto.dto_entrance.FeedbackDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.FeedbackDtoExit;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.service.feedback.FeedbackService;
import com.musichouse.api.music.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/feedback")
public class FeedbackController {
    private final FeedbackService feedbackService;

    // 🔹 AGREGAR FEEDBACK
    @PostMapping()
    public ResponseEntity<ApiResponse<FeedbackDtoExit>> userAddFeedback(
            @RequestBody
            @Valid
            FeedbackDtoEntrance feedbackDtoEntrance
    ) throws ResourceNotFoundException {
        FeedbackDtoExit feedbackDtoExit = feedbackService.userAddFeedback(feedbackDtoEntrance);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<FeedbackDtoExit>builder()
                        .status(HttpStatus.CREATED)
                        .statusCode(HttpStatus.CREATED.value())
                        .message("Feedback agregado con éxito.")
                        .error(null)
                        .result(feedbackDtoExit)
                        .build());
    }


    // 🔹 OBTENER TODOS LOS FEEDBACK
    @GetMapping()
    public ResponseEntity<ApiResponse<Page<FeedbackDtoExit>>> allTheme(Pageable pageable) {

        Page<FeedbackDtoExit> feedbackDtoExits = feedbackService.feedbackAll(pageable);
        return ResponseEntity.ok(ApiResponse.<Page<FeedbackDtoExit>>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Lista de feedback obtenida exitosamente.")
                .error(null)
                .result(feedbackDtoExits)
                .build());
    }
}
