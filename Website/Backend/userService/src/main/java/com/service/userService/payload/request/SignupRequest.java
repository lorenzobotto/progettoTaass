package com.service.userService.payload.request;

import javax.validation.constraints.Email;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class SignupRequest {
    @Size(max = 20)
    private String username;

    @Size(max = 50)
    @Email
    private String email;

    private String password;

    private Set<String> role;

    private String nome;

    private String cognome;

    @Size(max = 20)
    private String telefono;

    private String nomeStruttura;

    private Integer capienza;

    private String indirizzo;

    private String citta;

    @Size(max = 15)
    private String cap;

    private String prezzo;

    private String provider;

    private List<String> giorniLavoro = new ArrayList<>();

    private String animaliDaAccudire;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<String> getRole() {
        return role;
    }

    public void setRole(Set<String> role) {
        this.role = role;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCognome() {
        return cognome;
    }

    public void setCognome(String cognome) {
        this.cognome = cognome;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getNomeStruttura() {
        return nomeStruttura;
    }

    public void setNomeStruttura(String nomeStruttura) {
        this.nomeStruttura = nomeStruttura;
    }

    public Integer getCapienza() {
        return capienza;
    }

    public void setCapienza(Integer capienza) {
        this.capienza = capienza;
    }

    public String getIndirizzo() {
        return indirizzo;
    }

    public void setIndirizzo(String indirizzo) {
        this.indirizzo = indirizzo;
    }

    public String getCitta() {
        return citta;
    }

    public void setCitta(String citta) {
        this.citta = citta;
    }

    public String getCap() {
        return cap;
    }

    public void setCap(String cap) {
        this.cap = cap;
    }

    public String getPrezzo() {
        return prezzo;
    }

    public void setPrezzo(String prezzo) {
        this.prezzo = prezzo;
    }

    public List<String> getGiorniLavoro() {
        return giorniLavoro;
    }

    public void setGiorniLavoro(List<String> giorniLavoro) {
        this.giorniLavoro = giorniLavoro;
    }

    public String getAnimaliDaAccudire() {
        return animaliDaAccudire;
    }

    public void setAnimaliDaAccudire(String animaliDaAccudire) {
        this.animaliDaAccudire = animaliDaAccudire;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }
}