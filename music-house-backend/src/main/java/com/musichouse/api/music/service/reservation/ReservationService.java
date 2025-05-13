package com.musichouse.api.music.service.reservation;

import com.musichouse.api.music.dto.dto_entrance.ReservationDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.ReservationDtoExit;
import com.musichouse.api.music.entity.AvailableDate;
import com.musichouse.api.music.entity.Instrument;
import com.musichouse.api.music.entity.Reservation;
import com.musichouse.api.music.entity.User;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.infra.MailManager;
import com.musichouse.api.music.interfaces.ReservationInterface;
import com.musichouse.api.music.repository.AvailableDateRepository;
import com.musichouse.api.music.repository.InstrumentRepository;
import com.musichouse.api.music.repository.ReservationRepository;
import com.musichouse.api.music.repository.UserRepository;
import com.musichouse.api.music.service.instrument.InstrumentValidator;
import com.musichouse.api.music.service.userAdmin.UserValidator;
import com.musichouse.api.music.telegramchat.TelegramService;
import com.musichouse.api.music.util.CodeGenerator;
import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class ReservationService implements ReservationInterface {
    private final static Logger LOGGER = LoggerFactory.getLogger(ReservationService.class);
    private final ReservationRepository reservationRepository;
    private final ModelMapper mapper;
    private final InstrumentRepository instrumentRepository;
    private final UserRepository userRepository;
    private final TelegramService telegramService;
    private final UserValidator userValidator;
    private final InstrumentValidator instrumentValidator;
    private final ReservationValidator reservationValidator;
    private final ReservationPriceCalculator reservationPriceCalculator;
    private final ReservationBuilder reservationBuilder;
    private final ReservationNotifier reservationNotifier;
    private final AvailableDateRepository availableDateRepository;
    @Autowired
    private final MailManager mailManager;

    @CacheEvict(value = "availableDates", key = "#reservationDtoEntrance.idInstrument")
    public ReservationDtoExit createReservation(ReservationDtoEntrance reservationDtoEntrance)
            throws ResourceNotFoundException, MessagingException, IOException {

        User user = userValidator.validateUserId(reservationDtoEntrance.getIdUser());

        Instrument instrument = instrumentValidator.validateInstrumentId(reservationDtoEntrance.getIdInstrument());

        reservationValidator.validateReservationConditions(
                user,
                instrument,
                reservationDtoEntrance.getStartDate(),
                reservationDtoEntrance.getEndDate());

        reservationValidator.validateRentalDuration(reservationDtoEntrance.getStartDate(), reservationDtoEntrance.getEndDate());

        BigDecimal totalPrice = reservationPriceCalculator.calculateTotalPrice(
                instrument.getRentalPrice(),
                reservationDtoEntrance.getStartDate(),
                reservationDtoEntrance.getEndDate()
        );

        Reservation reservation = reservationBuilder.
                buildReservation(
                        user,
                        instrument,
                        reservationDtoEntrance.getStartDate(),
                        reservationDtoEntrance.getEndDate(),
                        totalPrice
                );

        Reservation reservationSaved = reservationRepository.save(reservation);

        List<AvailableDate> datesToUpdate =
                availableDateRepository.findByInstrumentIdInstrumentAndDateAvailableBetween(
                        instrument.getIdInstrument(),
                        reservation.getStartDate(),
                        reservation.getEndDate()
                );

        for (AvailableDate date : datesToUpdate) {
            date.setAvailable(false);
            availableDateRepository.save(date);
        }

        ReservationDtoExit reservationDtoExit = reservationBuilder.buildDtoReservationExit(
                reservationSaved,
                user,
                instrument,
                totalPrice
        );

        String reservationCode = CodeGenerator.generateCodeRandom();

        reservationNotifier.notifyReservation(reservationDtoExit, reservationCode, user);

        return reservationDtoExit;
    }


    @Override
    public Page<ReservationDtoExit> getReservationByUserId(UUID userId, Pageable pageable) {
        Page<Reservation> reservations = reservationRepository.findByUserId(userId, pageable);

        return reservations.map(reservation ->
                reservationBuilder.buildDtoReservationExit(
                        reservation,
                        reservation.getUser(),
                        reservation.getInstrument(),
                        reservation.getTotalPrice()
                )
        );
    }


    @CacheEvict(value = "availableDates", key = "#idInstrument")
    public ReservationDtoExit cancelReservation(UUID idInstrument, UUID idUser, UUID idReservation)
            throws ResourceNotFoundException {

        Reservation reservation = reservationRepository.findById(idReservation)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada."));

        if (!reservation.getUser().getIdUser().equals(idUser)) {
            throw new ResourceNotFoundException("No tienes permiso para cancelar esta reserva.");
        }

        if (!reservation.getInstrument().getIdInstrument().equals(idInstrument)) {
            throw new ResourceNotFoundException("La reserva no pertenece a este instrumento.");
        }

        if (reservation.isCancelled()) {
            throw new IllegalStateException("La reserva ya fue cancelada.");
        }

        // Marcar como cancelada
        reservation.setCancelled(true);
        
        reservationRepository.save(reservation);

        // Si la cancelación es dentro de las 24h, liberar las fechas
        long hoursBefore = java.time.Duration.between(
                java.time.LocalDate.now().atStartOfDay(),
                reservation.getStartDate().atStartOfDay()
        ).toHours();

        if (hoursBefore <= 24) {
            List<AvailableDate> datesToFree = availableDateRepository
                    .findByInstrumentIdInstrumentAndDateAvailableBetween(
                            idInstrument,
                            reservation.getStartDate(),
                            reservation.getEndDate()
                    );

            for (AvailableDate date : datesToFree) {
                date.setAvailable(true);
                availableDateRepository.save(date);
            }
        }

        return reservationBuilder.buildDtoReservationExit(
                reservation,
                reservation.getUser(),
                reservation.getInstrument(),
                reservation.getTotalPrice()
        );
    }
}
