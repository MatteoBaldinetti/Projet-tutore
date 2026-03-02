package com.agora.pretetgo.models;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@Entity
@DiscriminatorValue("ITEM")
public class Item extends Resource {
    private Integer serialNumber;

    @ManyToOne
    @JoinColumn(name = "item_type_id")
    private ItemType itemType;

    @ManyToOne
    @JoinColumn(name = "usage_pdf_id")
    private FileMetaData usagePdf;

    public Item(String name, String description, Set<Professor> managedBy, Boolean available, FileMetaData image, FileMetaData model3d, Instant createdAt, Integer serialNumber, ItemType itemType, FileMetaData usagePdf) {
        super(name, description, managedBy, available, image, model3d, createdAt);
        this.serialNumber = serialNumber;
        this.itemType = itemType;
        this.usagePdf = usagePdf;
    }
}
