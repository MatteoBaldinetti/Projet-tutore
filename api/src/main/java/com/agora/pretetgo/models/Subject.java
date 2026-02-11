package com.agora.pretetgo.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@Entity
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    @ManyToMany(mappedBy = "subjects")
    private Set<Professor> professors;

    public Subject(String name, String description, Set<Professor> professors) {
        this.name = name;
        this.description = description;
        this.professors = professors;
    }

}
