package com.agora.pretetgo.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@Entity
@DiscriminatorValue("PROFESSOR")
public class Professor extends User {
    @EqualsAndHashCode.Exclude
    @ManyToMany
    @JoinTable(
            name = "professor_subject",
            joinColumns = @JoinColumn(name = "professor_id"),
            inverseJoinColumns = @JoinColumn(name = "subject_id")
    )
    private Set<Subject> subjects = new HashSet<>();

    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "managedBy")
    private List<Resource> resources = new ArrayList<>();

    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "createdBy")
    private List<ItemType> itemTypes = new ArrayList<>();

    public Professor(String firstName, String lastName, String email, String password, Instant createdAt, Boolean enabled, Set<Subject> subjects) {
        super(firstName, lastName, email, password, createdAt, enabled);
        this.subjects = subjects;
    }

}
