package com.agora.pretetgo.models;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.time.Instant;

@Entity
@DiscriminatorValue("ITEM")
public class Item extends Resource {
    private Integer serialNumber;

    @ManyToOne
    @JoinColumn(name = "type_id")
    private ItemType type;

    public Item() {
        super();
    }

    public Item(String name, String description, Professor managedBy, Boolean available, Instant createdAt, Integer serialNumber, ItemType type) {
        super(name, description, managedBy, available, createdAt);
        this.serialNumber = serialNumber;
        this.type = type;
    }

    public Integer getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(Integer serialNumber) {
        this.serialNumber = serialNumber;
    }

    public ItemType getType() {
        return type;
    }

    public void setType(ItemType type) {
        this.type = type;
    }
}
