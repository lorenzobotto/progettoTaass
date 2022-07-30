package com.service.reservationService.payload.request;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;

public class ReservationRequest {

    private long user_id;

    private long user_to;

    private String startDate;

    private String endDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private BigDecimal prezzo;

    private String cure;

    private String socievole;

    private String transactionId;

    public long getUser_id() {
        return user_id;
    }

    public void setUser_id(long user_id) {
        this.user_id = user_id;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public BigDecimal getPrezzo() {
        return prezzo;
    }

    public void setPrezzo(BigDecimal prezzo) {
        this.prezzo = prezzo;
    }

    public String getCure() {
        return cure;
    }

    public void setCure(String cure) {
        this.cure = cure;
    }

    public String getSocievole() {
        return socievole;
    }

    public void setSocievole(String socievole) {
        this.socievole = socievole;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public long getUser_to() {
        return user_to;
    }

    public void setUser_to(long user_to) {
        this.user_to = user_to;
    }
}
