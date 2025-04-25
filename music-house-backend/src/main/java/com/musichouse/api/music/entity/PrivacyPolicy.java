package com.musichouse.api.music.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;
import java.util.UUID;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "PRIVACY_POLICY")
public class PrivacyPolicy {
    @Id
    @GeneratedValue(generator = "UUID")
    private UUID idPrivacyPolicy;

    @Lob
    @Column(nullable = false)
    private String title;

    @Lob
    @Column(nullable = false)
    private String content;

    @CreationTimestamp
    @Temporal(TemporalType.DATE)
    private Date registDate;
}
