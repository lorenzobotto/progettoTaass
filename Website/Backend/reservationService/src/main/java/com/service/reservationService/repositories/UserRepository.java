package com.service.reservationService.repositories;

import com.service.reservationService.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    User findByEmail(String username);
    Optional<User> findById(Long id);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);

    @Query(value = "SELECT DISTINCT CASE WHEN COUNT(*) > 0 THEN true ELSE false END FROM users AS u, user_roles AS ur, roles AS r, giorni_lavoro as gl\n" +
            "WHERE gl.id = u.id\n" +
            "AND u.id = ?1\n" +
            "AND gl.giorni_lavoro = ?2", nativeQuery = true)
    Boolean findUsersWorks(long id, String day);

    @Query(value = "SELECT DISTINCT u.* FROM users AS u, user_roles AS ur, roles AS r\n" +
            "WHERE u.id = ur.user_id\n" +
            "AND ur.role_id = r.id\n" +
            "AND r.name = 'ROLE_PETSITTER'" +
            "AND (u.animali_da_accudire = ?1) OR (u.animali_da_accudire = 'entrambi')", nativeQuery = true)
    List<User> findAllPetsitter(String animale);

    @Query(value = "SELECT DISTINCT u.* FROM users AS u, user_roles AS ur, roles AS r\n" +
            "WHERE u.id = ur.user_id\n" +
            "AND ur.role_id = r.id\n" +
            "AND r.name = 'ROLE_STRUCTURE'", nativeQuery = true)
    List<User> findAllStructure();

    @Query(value = "SELECT COUNT(*) > 0 FROM users\n" +
            "WHERE email = ?1\n" +
            "AND NOT id=?2", nativeQuery = true)
    Boolean findAvailableUserEmail(String email, Long id);

    @Query(value = "SELECT COUNT(*) > 0 FROM users\n" +
            "WHERE username = ?1\n" +
            "AND NOT id=?2", nativeQuery = true)
    Boolean findAvailableUserUsername(String username, Long id);

    @Query(value = "SELECT * FROM users WHERE email=?1 AND provider=?2", nativeQuery = true)
    User findByEmailProvider (String email, String provider);
}
