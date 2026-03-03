package com.agora.pretetgo.specifications;

import com.agora.pretetgo.dto.filter.ItemFilterDTO;
import com.agora.pretetgo.models.Item;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ItemSpecification extends BaseSpecification {
    public static Specification<Item> withFilter(ItemFilterDTO filter) {
        return (root, _, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            addEqual(predicates, criteriaBuilder, root.get("id"), filter.id());
            addLike(predicates, criteriaBuilder, root.get("name"), filter.name());
            addLike(predicates, criteriaBuilder, root.get("description"), filter.description());
            addIn(predicates, root.join("managedBy").get("id"), filter.managedByIds());
            addEqual(predicates, criteriaBuilder, root.get("available"), filter.available());
            addIn(predicates, root.get("images").get("id"), filter.imageIds());
            addEqual(predicates, criteriaBuilder, root.get("model3d").get("id"), filter.model3dId());
            addEqual(predicates, criteriaBuilder, root.get("serialNumber"), filter.serialNumber());
            addEqual(predicates, criteriaBuilder, root.get("itemType").get("id"), filter.itemTypeId());
            addEqual(predicates, criteriaBuilder, root.get("usagePdf").get("id"), filter.usagePdfId());
            addEqual(predicates, criteriaBuilder, root.get("createdAt"), filter.createdAt());
            addBetween(predicates, criteriaBuilder, root.get("createdAt"), filter.createdFrom(), filter.createdTo());

            return andAll(criteriaBuilder, predicates);
        };
    }
}