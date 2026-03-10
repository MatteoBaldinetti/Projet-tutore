package com.agora.pretetgo.specifications;

import com.agora.pretetgo.dto.filter.TagFilterDTO;
import com.agora.pretetgo.models.Tag;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class TagSpecification extends BaseSpecification {
    public static Specification<Tag> withFilter(TagFilterDTO filter) {
        return (root, _, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            addEqual(predicates, criteriaBuilder, root.get("id"), filter.id());
            addLike(predicates, criteriaBuilder, root.get("name"), filter.name());
            addIn(predicates, root.join("resources").get("id"), filter.resourceIds());
            addEqual(predicates, criteriaBuilder, root.get("createdBy").get("id"), filter.createdById());
            addEqual(predicates, criteriaBuilder, root.get("createdAt"), filter.createdAt());
            addBetween(predicates, criteriaBuilder, root.get("createdAt"), filter.createdFrom(), filter.createdTo());

            return andAll(criteriaBuilder, predicates);
        };
    }
}