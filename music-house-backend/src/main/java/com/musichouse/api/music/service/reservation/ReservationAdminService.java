package com.musichouse.api.music.service.reservation;

import com.musichouse.api.music.dto.dto_exit.ReservationDtoExit;
import com.musichouse.api.music.entity.Instrument;
import com.musichouse.api.music.entity.Reservation;
import com.musichouse.api.music.entity.User;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.repository.ReservationRepository;
import com.musichouse.api.music.service.instrument.InstrumentValidator;
import com.musichouse.api.music.service.userAdmin.UserValidator;
import com.musichouse.api.music.telegramchat.TelegramService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class ReservationAdminService {
    private final ReservationRepository reservationRepository;
    private final TelegramService telegramService;
    private final UserValidator userValidator;
    private final InstrumentValidator instrumentValidator;
    private final ReservationValidator reservationValidator;
    private final ModelMapper modelMapper;
    private final ReservationBuilder reservationBuilder;

    @CacheEvict(value = "reservations", allEntries = true)
    public void deleteReservation(UUID idInstrument, UUID idUser, UUID idReservation) throws ResourceNotFoundException {

        User user = userValidator.validateUserId(idUser);

        Instrument instrument = instrumentValidator.validateInstrumentId(idInstrument);

        Reservation reservation = reservationValidator.validateReservationId(idReservation);

        reservationValidator.validateUserAndInstrumentMatchReservation(reservation, idUser, idInstrument);

        //telegramService.enviarMensajeDeCancelacion(user.getTelegramChatId(), user.getName(), user.getLastName());

        reservationRepository.delete(reservation);
    }


    @Cacheable(value = "reservations",
            key = "'all-' + #pageable.pageNumber + '-' + #pageable.pageSize + '-' + #pageable.sort.toString()")
    public Page<ReservationDtoExit> getAllReservation(Pageable pageable) {
        Page<Reservation> reservations = reservationRepository.findAll(pageable);

        return reservations.map(reservation ->
                reservationBuilder.buildDtoReservationExit(
                        reservation,
                        reservation.getUser(),
                        reservation.getInstrument(),
                        reservation.getTotalPrice()
                )
        );
    }

    public List<LocalDate> getReservedDatesByInstrument(UUID idInstrument) {
        List<Reservation> reservations = reservationRepository.findByInstrumentIdInstrumentAndCancelledFalse(idInstrument);

        List<LocalDate> reservedDates = new ArrayList<>();

        for (Reservation reservation : reservations) {
            LocalDate start = reservation.getStartDate();
            LocalDate end = reservation.getEndDate();
            while (!start.isAfter(end)) {
                reservedDates.add(start);
                start = start.plusDays(1);
            }
        }

        return reservedDates;
    }
}
