package com.musichouse.api.music.dto.dto_exit;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDtoExit {

    private UUID idCategory;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "America/Santiago")
    private LocalDateTime registDate;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "America/Santiago")
    private LocalDateTime modifiedDate;

    private String categoryName;

    private String description;


}
