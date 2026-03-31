package com.agora.pretetgo.models;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.Instant;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@Entity
@DiscriminatorValue("SECURITY")
public class SecurityAgent extends User {
    public SecurityAgent(String firstName, String lastName, String email, String password, Boolean enabled, Instant createdAt) {
        super(firstName, lastName, email, password, enabled, createdAt);
    }
}
