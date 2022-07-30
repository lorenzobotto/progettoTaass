package com.service.reservationService.repositories;

import com.service.reservationService.models.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    @Query(value = "SELECT * FROM reservations WHERE user_id=?1", nativeQuery = true)
    List<Reservation> findAllReservations(Long id);

    @Query(value = "SELECT * FROM reservations WHERE user_to_id=?1", nativeQuery = true)
    List<Reservation> findAllReservationsOther(Long id);
}
