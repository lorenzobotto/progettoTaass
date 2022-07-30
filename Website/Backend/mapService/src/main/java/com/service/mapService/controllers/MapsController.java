package com.service.mapService.controllers;

import com.service.mapService.models.User;
import com.service.mapService.payload.response.AddressesResponse;
import com.service.mapService.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.text.Normalizer;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/maps")
public class MapsController {

    @Autowired
    UserRepository userRepository;

    @PostMapping("/allResults")
    public ResponseEntity<?> getAddressOfUsers(@Valid @RequestBody Map<String, String> infoDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String s = infoDate.get("startDate");
        String e = infoDate.get("endDate");
        LocalDate start = LocalDate.parse(s, formatter);
        LocalDate end = LocalDate.parse(e, formatter);
        List<String> totalDates = new ArrayList<>();
        while (!start.isAfter(end)) {
            totalDates.add(formatter.format(start));
            start = start.plusDays(1);
        }
        List<String> giorniLavoro = new ArrayList<>();
        for (String totalDate : totalDates) {
            LocalDate date = LocalDate.parse(totalDate, formatter);
            String normalizeWord = Normalizer.normalize(date.getDayOfWeek().getDisplayName(TextStyle.FULL_STANDALONE, Locale.ITALIAN), Normalizer.Form.NFD);
            String finalWord = normalizeWord.replaceAll("\\p{M}", "");
            if (!giorniLavoro.contains(finalWord)) {
                giorniLavoro.add(finalWord);
            }
        }

        List<User> allUsersWhoWorks = userRepository.findAllStructure();
        List<User> allPetsitter = userRepository.findAllPetsitter(infoDate.get("animal"));
        for (User petsitter: allPetsitter) {
            boolean userWork = true;
            for (String giornoLavoro : giorniLavoro) {
                if (!userRepository.findUsersWorks(petsitter.getId(), giornoLavoro)) {
                    userWork = false;
                }
            }
            if (userWork) {
                allUsersWhoWorks.add(petsitter);
            }
        }
        List<AddressesResponse> addressesUsers = new ArrayList<>();
        for (User user : allUsersWhoWorks) {
            addressesUsers.add(new AddressesResponse(
                    user.getId(),
                    user.getEmail(),
                    user.getNome(),
                    user.getCognome(),
                    user.getTelefono(),
                    user.getNomeStruttura(),
                    user.getCapienza(),
                    user.getIndirizzo(),
                    user.getCitta(),
                    user.getCap(),
                    user.getPrezzo(),
                    user.getAnimaliDaAccudire()
            ));
        }
        return ResponseEntity.ok(addressesUsers);
    }
}
