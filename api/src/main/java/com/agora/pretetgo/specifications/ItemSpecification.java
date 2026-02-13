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
            addEqual(predicates, criteriaBuilder, root.get("managedBy").get("id"), filter.managedById());
            addEqual(predicates, criteriaBuilder, root.get("available"), filter.available());
            addEqual(predicates, criteriaBuilder, root.get("createdAt"), filter.createdAt());
            addEqual(predicates, criteriaBuilder, root.get("serialNumber"), filter.serialNumber());
            addEqual(predicates, criteriaBuilder, root.get("type").get("id"), filter.typeId());
            addBetween(predicates, criteriaBuilder, root.get("createdAt"), filter.createdFrom(), filter.createdTo());

            return andAll(criteriaBuilder, predicates);
        };
    }
}