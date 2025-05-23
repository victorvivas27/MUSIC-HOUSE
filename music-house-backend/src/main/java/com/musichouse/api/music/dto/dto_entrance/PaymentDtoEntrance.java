package com.musichouse.api.music.dto.dto_entrance;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter

@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
public class PaymentDtoEntrance {

    @NotBlank(message = "El tipo de pago es obligatorio")
    @Size(max = 50, message = "El tipo de pago debe tener como máximo {max} caracteres")
    private String paymentType;

    @NotBlank(message = "El número de tarjeta es obligatorio")
    @Size(min = 13, max = 19, message = "El número de tarjeta debe tener entre {min} y {max} caracteres")
    private String cardNumber;

    @NotBlank(message = "El nombre del titular de la tarjeta es obligatorio")
    @Size(max = 100, message = "El nombre del titular debe tener como máximo {max} caracteres")
    private String cardHolderName;

    @NotBlank(message = "La fecha de vencimiento es obligatoria")
    @Pattern(regexp = "^(0[1-9]|1[0-2])/\\d{2}$", message = "La fecha de vencimiento debe tener el formato MM/YY")
    private String expirationDate;

    @NotBlank(message = "El CVV es obligatorio")
    @Size(min = 3, max = 4, message = "El CVV debe tener entre {min} y {max} caracteres")
    private String cvv;

    //@NotNull(message = "El monto es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El monto debe ser mayor que cero")
    @Digits(integer = 8, fraction = 2, message = "El monto debe tener como máximo 8 dígitos enteros y 2 decimales")
    private BigDecimal amount;

    @NotBlank(message = "La moneda es obligatoria")
    @Size(max = 10, message = "La moneda debe tener como máximo {max} caracteres")
    private String currency;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe tener un formato válido")
    @Size(max = 100, message = "El email debe tener como máximo {max} caracteres")
    private String email;

    @NotBlank(message = "El número de documento es obligatorio")
    @Size(max = 20, message = "El número de documento debe tener como máximo {max} caracteres")
    private String documentNumber;
}
