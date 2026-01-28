package com.agora.pretetgo.models;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
@DiscriminatorValue("ITEM")
public class Item extends Resource {
    private Integer serialNumber;

    @ManyToOne
    @JoinColumn(name = "type_id")
    private ItemType type;
}
