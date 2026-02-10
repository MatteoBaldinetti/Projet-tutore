package com.agora.pretetgo.models;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue("STUDENT")
public class Student extends User {
    private Integer studentNumber;

    @OneToMany(mappedBy = "student")
    private List<ReservationGroupStudent> reservationGroupStudents = new ArrayList<>();

    public Student() {
        super();
    }

    public Student(String firstName, String lastName, String email, String password, Instant createdAt, Boolean enabled, Integer studentNumber) {
        super(firstName, lastName, email, password, createdAt, enabled);
        this.studentNumber = studentNumber;
    }

    public Integer getStudentNumber() {
        return studentNumber;
    }

    public void setStudentNumber(Integer studentNumber) {
        this.studentNumber = studentNumber;
    }

    public List<ReservationGroupStudent> getReservationGroupStudents() {
        return reservationGroupStudents;
    }

    public void setReservationGroupStudents(List<ReservationGroupStudent> reservationGroupStudents) {
        this.reservationGroupStudents = reservationGroupStudents;
    }
}
