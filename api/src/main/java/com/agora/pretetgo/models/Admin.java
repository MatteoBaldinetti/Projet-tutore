package com.agora.pretetgo.models;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

import java.time.Instant;

@Entity
@DiscriminatorValue("ADMIN")
public class Admin extends User {
    public Admin() {
        super();
    }

    public Admin(String firstName, String lastName, String email, String password, Instant createdAt, Boolean enabled) {
        super(firstName, lastName, email, password, createdAt, enabled);
    }
}
