package com.agora.pretetgo.models;

import jakarta.persistence.*;

import java.util.Set;

@Entity
@DiscriminatorValue("PROFESSOR")
public class Professor extends User {
    @ManyToMany
    @JoinTable(
            name = "professor_subject",
            joinColumns = @JoinColumn(name = "professor_id"),
            inverseJoinColumns = @JoinColumn(name = "subject_id")
    )
    private Set<Subject> subjects;
}
