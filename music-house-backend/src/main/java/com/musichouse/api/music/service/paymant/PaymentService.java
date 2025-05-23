package com.musichouse.api.music.service.paymant;

import com.musichouse.api.music.dto.dto_entrance.PaymentDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.PaymentDtoExit;
import com.musichouse.api.music.entity.Payment;
import com.musichouse.api.music.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentBuilder paymentBuilder;

    public PaymentDtoExit createPayment(PaymentDtoEntrance dto) {
        // Mapeo manual de DTO a entidad
        Payment payment = paymentBuilder.buildPayment(dto);

        Payment saved = paymentRepository.save(payment);

        // Mapeo a DTO de salida
        return paymentBuilder.buildPaymentExit(saved);
    }


}
