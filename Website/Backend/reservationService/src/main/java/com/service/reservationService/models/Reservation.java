package com.service.reservationService.models;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "reservations")
public class Reservation {
    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private User userTo;

    @Basic
    @Temporal(TemporalType.DATE)
    private Date startDate;

    @Basic
    @Temporal(TemporalType.DATE)
    private Date endDate;

    private BigDecimal prezzo;

    @Column(columnDefinition="TEXT")
    private String cure;

    @Column(columnDefinition="TEXT")
    private String socievole;

    private String transactionId;

    private LocalDate dateOfReservation;

    private LocalDate dateOfCancellation;

    public Reservation(User user, Date startDate, Date endDate, BigDecimal prezzo, String cure, String socievole, String transactionId) {
        this.user = user;
        this.startDate = startDate;
        this.endDate = endDate;
        this.prezzo = prezzo;
        this.cure = cure;
        this.socievole = socievole;
        this.transactionId = transactionId;
    }

    public Reservation () {}

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
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

    public BigDecimal getPrezzo() {
        return prezzo;
    }

    public void setPrezzo(BigDecimal prezzo) {
        this.prezzo = prezzo;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public LocalDate getDateOfReservation() {
        return dateOfReservation;
    }

    public void setDateOfReservation(LocalDate dateOfReservation) {
        this.dateOfReservation = dateOfReservation;
    }

    public LocalDate getDateOfCancellation() {
        return dateOfCancellation;
    }

    public void setDateOfCancellation(LocalDate dateOfCancellation) {
        this.dateOfCancellation = dateOfCancellation;
    }

    public User getUserTo() {
        return userTo;
    }

    public void setUserTo(User userTo) {
        this.userTo = userTo;
    }
}
