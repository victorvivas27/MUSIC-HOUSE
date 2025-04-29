package com.musichouse.api.music.dto.dto_exit;

import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InstrumentFavoriteDtoExit {

    private UUID idInstrument;

    private String name;

    private String imageUrl;

    private BigDecimal rentalPrice;
}
