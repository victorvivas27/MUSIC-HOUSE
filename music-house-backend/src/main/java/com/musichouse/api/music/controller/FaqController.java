package com.musichouse.api.music.controller;

import com.musichouse.api.music.dto.dto_entrance.FaqDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.FaqDtoExit;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.service.faq.FaqService;
import com.musichouse.api.music.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/api/faq")
public class FaqController {
    private final FaqService faqService;

    // 🔹 AGREGAR FAQ
    @PostMapping()
    public ResponseEntity<ApiResponse<FaqDtoExit>> FaqAdd(
            @RequestBody
            @Valid
            FaqDtoEntrance faqDtoEntrance
    ) throws ResourceNotFoundException {
        FaqDtoExit faqDtoExit = faqService.FaqCreate(faqDtoEntrance);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<FaqDtoExit>builder()
                        .status(HttpStatus.CREATED)
                        .statusCode(HttpStatus.CREATED.value())
                        .message("Pregunta enviada con exito")
                        .error(null)
                        .result(faqDtoExit)
                        .build());
    }
    
}
