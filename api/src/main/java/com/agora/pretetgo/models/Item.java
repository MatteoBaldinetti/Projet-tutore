package com.agora.pretetgo.models;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.Instant;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@Entity
@DiscriminatorValue("ITEM")
public class Item extends Resource {
    private Integer serialNumber;

    @ManyToOne
    @JoinColumn(name = "type_id")
    private ItemType type;

    public Item(String name, String description, Professor managedBy, Boolean available, Instant createdAt, Integer serialNumber, ItemType type) {
        super(name, description, managedBy, available, createdAt);
        this.serialNumber = serialNumber;
        this.type = type;
    }

}
