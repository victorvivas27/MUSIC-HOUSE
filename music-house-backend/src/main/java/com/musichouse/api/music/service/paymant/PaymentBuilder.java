package com.musichouse.api.music.service.paymant;

import com.musichouse.api.music.dto.dto_entrance.PaymentDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.PaymentDtoExit;
import com.musichouse.api.music.entity.Payment;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class PaymentBuilder {

    public Payment buildPayment(PaymentDtoEntrance dto) {
        return Payment.builder()
                .paymentType(dto.getPaymentType())
                .cardNumber(dto.getCardNumber())
                .cardHolderName(dto.getCardHolderName())
                .expirationDate(dto.getExpirationDate())
                .cvv(dto.getCvv())
                .amount(dto.getAmount())
                .currency(dto.getCurrency())
                .email(dto.getEmail())
                .documentNumber(dto.getDocumentNumber())
                .status("SUCCESS") // O "PENDING", según tu lógica
                .paymentDate(LocalDateTime.now())
                .build();

    }


    public PaymentDtoExit buildPaymentExit(Payment saved) {
        return PaymentDtoExit.builder()
                .id(saved.getId())
                .paymentType(saved.getPaymentType())
                .cardLast4(getLast4(saved.getCardNumber()))
                .amount(saved.getAmount())
                .currency(saved.getCurrency())
                .email(saved.getEmail())
                .status(saved.getStatus())
                .paymentDate(saved.getPaymentDate())
                .build();
    }

    private String getLast4(String cardNumber) {
        return cardNumber != null && cardNumber.length() >= 4
                ? cardNumber.substring(cardNumber.length() - 4)
                : "****";
    }
}
