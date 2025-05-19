package com.musichouse.api.music.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String paymentType;
    private String cardNumber;
    private String cardHolderName;
    private String expirationDate;
    private String cvv;
    private double amount;
    private String currency;
    private String email;
    private String documentNumber;
    private String status;      // "APPROVED", "DECLINED", etc.
    private LocalDateTime paymentDate;

    // Getters y setters
}
