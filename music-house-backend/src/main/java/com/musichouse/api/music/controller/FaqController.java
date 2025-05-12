package com.musichouse.api.music.controller;

import com.musichouse.api.music.dto.dto_entrance.FaqDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.FaqDtoExit;
import com.musichouse.api.music.dto.dto_modify.FaqDtoModify;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.service.faq.FaqService;
import com.musichouse.api.music.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

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


    // 🔹 OBTENER TODOS LOS FAQ
    @GetMapping()
    public ResponseEntity<ApiResponse<Page<FaqDtoExit>>> allFaq(Pageable pageable) {

        Page<FaqDtoExit> faqDtoExits = faqService.faqAll(pageable);
        return ResponseEntity.ok(ApiResponse.<Page<FaqDtoExit>>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Lista de preguntas frecuentes obtenida exitosamente.")
                .error(null)
                .result(faqDtoExits)
                .build());
    }

    // 🔹 ELIMINAR FEEDBCK
    @DeleteMapping("{idFaq}")
    public ResponseEntity<ApiResponse<String>> deleteFaq(@PathVariable UUID idFaq) throws ResourceNotFoundException {

        faqService.deleteFaq(idFaq);

        return ResponseEntity.ok(ApiResponse.<String>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Pregunta frecuente eliminada exitosamente.")
                .error(null)
                .result(null)
                .build());
    }


    // 🔹 ACTUALIZAR FAQ
    @PatchMapping()
    public ResponseEntity<ApiResponse<?>> updateFaq(
            @RequestBody @Valid FaqDtoModify faqDtoModify) throws ResourceNotFoundException {


        FaqDtoExit faqDtoExit = faqService.updateFaq(faqDtoModify);

        return ResponseEntity.ok(ApiResponse.<FaqDtoExit>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Pregunta actualizada con éxito.")
                .error(null)
                .result(faqDtoExit)
                .build());
    }

    // 🔹 BUSCAR CATEGORÍA POR ID
    @GetMapping("/{idFaq}")
    public ResponseEntity<ApiResponse<FaqDtoExit>> searchFaqById(@PathVariable UUID idFaq) throws ResourceNotFoundException {
        FaqDtoExit faqDtoExit = faqService.getFaqById(idFaq);

        return ResponseEntity.ok(ApiResponse.<FaqDtoExit>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Pregunata encontrada con éxito.")
                .error(null)
                .result(faqDtoExit)
                .build());
    }
}
