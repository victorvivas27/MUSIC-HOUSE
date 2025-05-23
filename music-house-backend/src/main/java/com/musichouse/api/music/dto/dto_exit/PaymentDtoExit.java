package com.musichouse.api.music.dto.dto_exit;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDtoExit {

    private UUID id;

    private String paymentType; // Ej: "Tarjeta de crédito"

    private String cardLast4; // Ej: "1234"

    private BigDecimal amount;

    private String currency;

    private String email;

    private String status; // SUCCESS, PENDING, FAILED

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "America/Santiago")
    private LocalDateTime paymentDate;
}