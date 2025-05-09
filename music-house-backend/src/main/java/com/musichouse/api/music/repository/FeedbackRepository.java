package com.musichouse.api.music.repository;

import com.musichouse.api.music.entity.Feedback;
import com.musichouse.api.music.entity.User;
import org.jvnet.hk2.annotations.Service;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

@Service
public interface FeedbackRepository extends JpaRepository<Feedback, UUID> {
    Optional<Feedback> findByUser(User user);
}
