package com.musichouse.api.music.controller;

import com.musichouse.api.music.dto.dto_exit.ReservationDtoExit;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.service.reservation.ReservationAdminService;
import com.musichouse.api.music.util.ApiResponse;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@AllArgsConstructor
@RequestMapping("/api/reservations")
public class ReservationAdminController {
    private final ReservationAdminService reservationAdminService;


    // 🔹 Listar todas las reservas (paginado + cache)
    @GetMapping()
    public ResponseEntity<ApiResponse<Page<ReservationDtoExit>>> getAllResvation(Pageable pageable) {

        Page<ReservationDtoExit> reservationDtoExits = reservationAdminService.getAllReservation(pageable);

        return ResponseEntity.ok(ApiResponse.<Page<ReservationDtoExit>>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Lista de reservas obtenida con éxito.")
                .error(null)
                .result(reservationDtoExits)
                .build());
    }

    // 🔹 ELIMINAR RESERVA
    @DeleteMapping("/{idInstrument}/{idUser}/{idReservation}")
    public ResponseEntity<ApiResponse<Void>> deleteReservation(
            @PathVariable UUID idInstrument,
            @PathVariable UUID idUser,
            @PathVariable UUID idReservation)
            throws ResourceNotFoundException {

        reservationAdminService.deleteReservation(idInstrument, idUser, idReservation);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Reserva eliminada con éxito.")
                .error(null)
                .result(null)
                .build());

    }

    @GetMapping("/instrument/{idInstrument}/reserved-dates")
    public ResponseEntity<List<LocalDate>> getReservedDates(@PathVariable UUID idInstrument) {
        List<LocalDate> reservedDates = reservationAdminService.getReservedDatesByInstrument(idInstrument);

        return ResponseEntity.ok(ApiResponse.<List<LocalDate>>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Reservas encontradas para el instrumento.")
                .result(reservedDates)
                .build().getResult());
    }
}
