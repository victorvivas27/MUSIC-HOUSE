package com.musichouse.api.music.interfaces;

import com.musichouse.api.music.dto.dto_entrance.ReservationDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.ReservationDtoExit;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import jakarta.mail.MessagingException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.IOException;
import java.util.UUID;

public interface ReservationInterface {

    ReservationDtoExit createReservation(ReservationDtoEntrance reservationDtoEntrance)
            throws ResourceNotFoundException, MessagingException, IOException;


    public Page<ReservationDtoExit> getReservationByUserId(UUID userId, Pageable pageable)
            throws ResourceNotFoundException;


}
