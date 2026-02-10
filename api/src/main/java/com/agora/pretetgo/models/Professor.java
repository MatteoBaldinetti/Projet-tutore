package com.agora.pretetgo.models;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
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
    private Set<Subject> subjects = new HashSet<>();

    @OneToMany(mappedBy = "managedBy")
    private List<Resource> resources = new ArrayList<>();

    @OneToMany(mappedBy = "createdBy")
    private List<ItemType> itemTypes = new ArrayList<>();

    public Professor() {
        super();
    }

    public Professor(String firstName, String lastName, String email, String password, Instant createdAt, Boolean enabled, Set<Subject> subjects) {
        super(firstName, lastName, email, password, createdAt, enabled);
        this.subjects = subjects;
    }

    public Set<Subject> getSubjects() {
        return subjects;
    }

    public void setSubjects(Set<Subject> subjects) {
        this.subjects = subjects;
    }

    public List<Resource> getResources() {
        return resources;
    }

    public void setResources(List<Resource> resources) {
        this.resources = resources;
    }

    public List<ItemType> getItemTypes() {
        return itemTypes;
    }

    public void setItemTypes(List<ItemType> itemTypes) {
        this.itemTypes = itemTypes;
    }
}
