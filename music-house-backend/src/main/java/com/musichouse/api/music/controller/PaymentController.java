package com.musichouse.api.music.controller;

import com.musichouse.api.music.dto.dto_entrance.PaymentDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.PaymentDtoExit;
import com.musichouse.api.music.service.paymant.PaymentService;
import com.musichouse.api.music.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<ApiResponse<PaymentDtoExit>> realizarPago(
            @Valid @RequestBody PaymentDtoEntrance paymentDtoEntrance) {

        PaymentDtoExit result = paymentService.createPayment(paymentDtoEntrance);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<PaymentDtoExit>builder()
                        .status(HttpStatus.CREATED)
                        .statusCode(HttpStatus.CREATED.value())
                        .message("Pago procesado exitosamente.")
                        .result(result)
                        .error(null)
                        .build());
    }
}
