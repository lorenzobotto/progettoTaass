package com.service.mapService.payload.response;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;

public class AddressesResponse {

    private long id;
    private String email;
    private String nome;
    private String cognome;
    private String telefono;
    private String nomeStruttura;
    private Integer capienza;
    private String indirizzo;
    private String citta;
    private String cap;

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private BigDecimal prezzo;
    private String animaliDaAccudire;
    
    public AddressesResponse (long id, String email, String nome, String cognome, String telefono, String nomeStruttura, Integer capienza, String indirizzo, String citta, String cap, BigDecimal prezzo, String animaliDaAccudire) {
        this.id = id;
        this.email = email;
        this.nome = nome;
        this.cognome = cognome;
        this.telefono = telefono;
        this.nomeStruttura = nomeStruttura;
        this.capienza = capienza;
        this.indirizzo = indirizzo;
        this.citta = citta;
        this.cap = cap;
        this.prezzo = prezzo;
        this.animaliDaAccudire = animaliDaAccudire;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public BigDecimal getPrezzo() {
        return prezzo;
    }

    public void setPrezzo(BigDecimal prezzo) {
        this.prezzo = prezzo;
    }

    public String getAnimaliDaAccudire() {
        return animaliDaAccudire;
    }

    public void setAnimaliDaAccudire(String animaliDaAccudire) {
        this.animaliDaAccudire = animaliDaAccudire;
    }
}
