package com.service.authService.controllers;

import com.service.authService.models.ERole;
import com.service.authService.models.Role;
import com.service.authService.models.User;
import com.service.authService.payload.request.LoginRequest;
import com.service.authService.payload.request.SignupRequest;
import com.service.authService.payload.response.JwtResponse;
import com.service.authService.payload.response.MessageResponse;
import com.service.authService.repositories.RoleRepository;
import com.service.authService.repositories.UserRepository;
import com.service.authService.security.jwt.JwtUtils;
import com.service.authService.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.math.BigDecimal;
import java.text.ParseException;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
    }

    @PostMapping("/signinSocial")
    public ResponseEntity<?> authenticateUserSocial(@Valid @RequestBody Map<String, String> info) {
        User user = userRepository.findByEmailProvider(info.get("email"), info.get("provider"));
        if (user != null) {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), ""));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new JwtResponse(jwt,
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail(),
                    roles));
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Utente non registrato con questa email!"));
        }
    }

    @PostMapping("/signin/available")
    public ResponseEntity<?> availableUserLogin(@Valid @RequestBody LoginRequest loginRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        return ResponseEntity.ok(new MessageResponse("User exists!"));
    }

    @PostMapping("/signup/available")
    public ResponseEntity<?> availableUser(@Valid @RequestBody Map<String, String> username) {
        if (userRepository.existsByUsername(username.get("username"))) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }
        if (userRepository.existsByEmail(username.get("username"))) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }
        return ResponseEntity.ok(new MessageResponse("Username and email available!"));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) throws ParseException {
        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()),
                signUpRequest.getTelefono(),
                signUpRequest.getNome(),
                signUpRequest.getCognome());

        System.out.println(signUpRequest.getGiorniLavoro().toString());

        if (signUpRequest.getNomeStruttura() != null) {
            user.setNomeStruttura(signUpRequest.getNomeStruttura());
        }

        if (signUpRequest.getCapienza() != null) {
            user.setCapienza(signUpRequest.getCapienza());
        }

        if (signUpRequest.getTelefono() != null) {
            user.setTelefono(signUpRequest.getTelefono());
        }

        if (signUpRequest.getIndirizzo() != null) {
            user.setIndirizzo(signUpRequest.getIndirizzo());
        }

        if (signUpRequest.getCitta() != null) {
            user.setCitta(signUpRequest.getCitta());
        }

        if (signUpRequest.getCap() != null) {
            user.setCap(signUpRequest.getCap());
        }

        if (signUpRequest.getPrezzo() != null) {
            BigDecimal prezzo = null;
            if (signUpRequest.getPrezzo().contains("€")) {
                prezzo = new BigDecimal(signUpRequest.getPrezzo().replaceAll("€", ""));
            } else {
                prezzo = new BigDecimal(signUpRequest.getPrezzo());
            }
            user.setPrezzo(prezzo);
        }

        if (signUpRequest.getGiorniLavoro() != null) {
            user.setGiorniLavoro(signUpRequest.getGiorniLavoro());
        }

        if (signUpRequest.getAnimaliDaAccudire() != null) {
            user.setAnimaliDaAccudire(signUpRequest.getAnimaliDaAccudire());
        }

        user.setProvider(signUpRequest.getProvider());

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "structure":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_STRUCTURE)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);

                        break;
                    case "petsitter":
                        Role modRole = roleRepository.findByName(ERole.ROLE_PETSITTER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);

                        break;
                    default:
                        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }
        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}