package com.service.userService.controllers;

import com.service.userService.models.User;
import com.service.userService.payload.request.SignupRequest;
import com.service.userService.payload.response.MessageResponse;
import com.service.userService.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @PostMapping("/getUser")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getAddressOfUsers(@Valid @RequestBody Map<String, Long> id) {
        Optional<User> user = userRepository.findById(id.get("id"));
        return ResponseEntity.ok(user);
    }

    @PostMapping("/getIdOfUser")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getIdOfUser(@Valid @RequestBody Map<String, String> username) {
        User user = userRepository.findByUsername(username.get("username"));
        return ResponseEntity.ok(new MessageResponse("" + user.getId()));
    }

    @PostMapping("/getUserUsername")
    @PreAuthorize("hasRole('USER') or hasRole('PETSITTER') or hasRole('STRUCTURE')")
    public ResponseEntity<?> getUserByUsername(@Valid @RequestBody Map<String, String> username) {
        User user = userRepository.findByUsername(username.get("username"));
        return ResponseEntity.ok(user);
    }

    @PostMapping("/availableUser")
    @PreAuthorize("hasRole('USER') or hasRole('PETSITTER') or hasRole('STRUCTURE')")
    public ResponseEntity<?> availableUser(@Valid @RequestBody Map<String, String> username) {
        if(userRepository.findAvailableUserEmail(username.get("username"), Long.parseLong(username.get("id")))) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already taken!"));
        }
        if (userRepository.findAvailableUserUsername(username.get("username"), Long.parseLong(username.get("id")))) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }
        return ResponseEntity.ok(new MessageResponse("Username and email available!"));
    }

    @PutMapping("/updateProfile/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('PETSITTER') or hasRole('STRUCTURE')")
    public ResponseEntity<?> updateUser(@PathVariable(value = "id") Long userId, @Valid @RequestBody SignupRequest user) {
        User newUser = userRepository.findById(userId).get();
        String userPass = newUser.getPassword();
        System.out.println(user.getPassword());
        if (user.getPassword() != null) {
            userPass = encoder.encode(user.getPassword());
        }
        newUser.setUsername(user.getUsername());
        newUser.setEmail(user.getEmail());
        newUser.setPassword(userPass);
        newUser.setTelefono(user.getTelefono());
        newUser.setNome(user.getNome());
        newUser.setCognome(user.getCognome());
        newUser.setNomeStruttura(user.getNomeStruttura());
        newUser.setCapienza(user.getCapienza());
        newUser.setTelefono(user.getTelefono());
        newUser.setIndirizzo(user.getIndirizzo());
        newUser.setCitta(user.getCitta());
        newUser.setCap(user.getCap());
        BigDecimal prezzo = null;
        if (user.getPrezzo() != null && user.getPrezzo().contains("€")) {
            prezzo = new BigDecimal(user.getPrezzo().replaceAll("€", ""));
        } else {
            if (user.getPrezzo() != null) {
                prezzo = new BigDecimal(user.getPrezzo());
            }
        }
        newUser.setPrezzo(prezzo);
        newUser.setGiorniLavoro(user.getGiorniLavoro());
        newUser.setAnimaliDaAccudire(user.getAnimaliDaAccudire());
        userRepository.save(newUser);
        return ResponseEntity.ok(new MessageResponse("User updated!"));
    }
}
