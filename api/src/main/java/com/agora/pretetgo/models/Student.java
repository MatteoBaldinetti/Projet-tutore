package com.agora.pretetgo.models;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@Entity
@DiscriminatorValue("STUDENT")
public class Student extends User {
    private Integer studentNumber;

    @OneToMany(mappedBy = "student")
    private List<ReservationGroupStudent> reservationGroupStudents = new ArrayList<>();

    public Student(String firstName, String lastName, String email, String password, Instant createdAt, Boolean enabled, Integer studentNumber) {
        super(firstName, lastName, email, password, createdAt, enabled);
        this.studentNumber = studentNumber;
    }

}
