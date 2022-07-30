package com.service.reservationService.controllers;

import com.service.reservationService.models.Reservation;
import com.service.reservationService.models.User;
import com.service.reservationService.payload.request.ReservationRequest;
import com.service.reservationService.payload.response.MessageResponse;
import com.service.reservationService.repositories.ReservationRepository;
import com.service.reservationService.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/reservations")
public class ReservationController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    ReservationRepository reservationRepository;

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/save")
    public ResponseEntity<?> registerReservation(@Valid @RequestBody ReservationRequest reservationRequest) throws ParseException {
        Date startDate = new SimpleDateFormat("dd/MM/yyyy").parse(reservationRequest.getStartDate());
        Date endDate = new SimpleDateFormat("dd/MM/yyyy").parse(reservationRequest.getEndDate());
        Optional<User> user = userRepository.findById(reservationRequest.getUser_id());
        Optional<User> userTo = userRepository.findById(reservationRequest.getUser_to());
        LocalDate dateOfCancellation = LocalDate.parse(reservationRequest.getStartDate(), DateTimeFormatter.ofPattern("dd/MM/yyyy")).minusDays(1);
        if (user.isPresent()) {
            Reservation reservation = new Reservation(user.get(), startDate, endDate, reservationRequest.getPrezzo(), reservationRequest.getCure(), reservationRequest.getSocievole(), reservationRequest.getTransactionId());
            reservation.setDateOfReservation(LocalDate.now());
            reservation.setDateOfCancellation(dateOfCancellation);
            reservation.setUserTo(userTo.get());
            reservationRepository.save(reservation);
            return ResponseEntity.ok(new MessageResponse("Reservation registered successfully!"));
        } else {
            return ResponseEntity.badRequest().body((new MessageResponse("UserID not valid.")));
        }
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/getReservationUser")
    public ResponseEntity<?> getReservationUser(@Valid @RequestBody Map<String, Long> id) throws ParseException {
        List<Reservation> reservations = reservationRepository.findAllReservations(id.get("id"));
        return ResponseEntity.ok(reservations);
    }

    @PreAuthorize("hasRole('PETSITTER') or hasRole('STRUCTURE')")
    @PostMapping("/getReservationOther")
    public ResponseEntity<?> getReservationOther(@Valid @RequestBody Map<String, Long> id) throws ParseException {
        List<Reservation> reservations = reservationRepository.findAllReservationsOther(id.get("id"));
        return ResponseEntity.ok(reservations);
    }

    @PreAuthorize("hasRole('USER')")
    @DeleteMapping(value = "/deleteReservation/{id}")
    public ResponseEntity<?> deleteReservation(@PathVariable Long id) {
        reservationRepository.deleteById(id);
        return ResponseEntity.ok(new MessageResponse("Prenotazione cancellata!"));
    }
}
